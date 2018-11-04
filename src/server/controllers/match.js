
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    p.query('SELECT * FROM match').then(
      results => {
        console.log(results);
        res.json({ matches: results.rows });
      });
  },

  createMatch(req, res) {
    p.query('INSERT INTO match (creator_id, title) VALUES ($1, $2) RETURNING id', ['U0000001', 'Eugene Wedding']).then(
      results => {
        const {id} = results.rows[0];
        res.json({
          matchId: id
        });
      }
    )
  },

  joinMatch(req, res) {

    let queryScore;
    let favorScore;

    let match_user_id;

    const businessScoreCollection = {};

    console.log(req);

    const keywords = req.query.keywords.split(' ');

    let buildQueriesWIthKeywords = '';
    let buildValuesWIthKeywords = [];

    keywords.map((kw, i) => {
      if (i === 0) {
        buildQueriesWIthKeywords = `tag_name = $${i + 1}`;
        buildValuesWIthKeywords.push(kw);
      } else {
        buildQueriesWIthKeywords = `${buildQueriesWIthKeywords} tag_name = $${i + 1}`;
        buildValuesWIthKeywords.push(kw);
      }
    });



    p.query(`SELECT DISTINCT id FROM tag WHERE ${buildQueriesWIthKeywords}`, buildValuesWIthKeywords)
      .then(res => {


        let buildFirstQueriesWIthKeywords = '';
        let buildSecondQueriesWIthKeywords = '';
        buildValuesWIthKeywords = [];

        res.rows.map((kw, i) => {
          if (i === 0) {
            buildFirstQueriesWIthKeywords = `st.id = $${i + 1}`;
            buildSecondQueriesWIthKeywords = `st.tag_id = $${i + 1}`;
            buildValuesWIthKeywords.push(kw.id);
          } else {
            buildFirstQueriesWIthKeywords = `${buildFirstQueriesWIthKeywords} OR st.id = $${i + 1}`;
            buildSecondQueriesWIthKeywords = `${buildSecondQueriesWIthKeywords} OR st.tag_id = $${i + 1}`;
            buildValuesWIthKeywords.push(kw.id);
          }
        });


        const keywordQuery = `SELECT business_id, SUM(ft.score * 2) as final_score ` +
          `FROM business_tag ft LEFT JOIN tag st on ft.tag_id = st.id WHERE ` +
          `${buildFirstQueriesWIthKeywords} GROUP BY ft.business_id`;

        const favorQuery = `SELECT business_id, SUM(ft.score * st.score) as final_score ` +
          `FROM business_tag ft LEFT JOIN user_tag st on ft.tag_id = st.tag_id ` +
          `WHERE ${buildSecondQueriesWIthKeywords} GROUP BY ft.business_id`;


        return Promise.all([
          p.query(keywordQuery, buildValuesWIthKeywords),
          p.query(favorQuery, buildValuesWIthKeywords),
          p.query('INSERT INTO match_user (match_id, user_id, weight) VALUES ($1, $2, $3) RETURNING id', [req.params.id, 'U0000001', 1])
        ]);

      }).then(
      ([res1, res2, res3]) => {
        queryScore = res1.rows;
        favorScore = res2.rows;
        match_user_id = res3.rows[0].id;

        queryScore.map(qs => {

          if (qs.businessId in businessScoreCollection) {
            businessScoreCollection[qs.business_id] += qs.final_score
          }
          else {
            businessScoreCollection[qs.business_id] = qs.final_score
          }
        });

        favorScore.map(fs => {
          if (fs.business_id in businessScoreCollection) {
            businessScoreCollection[fs.business_id] += fs.final_score
          }
          else {
            businessScoreCollection[fs.business_id] = fs.final_score
          }
        });

        const insertQueries = [];

        Object.keys(businessScoreCollection).forEach((key, index) => {

          insertQueries.push(p.query('INSERT INTO business_match (match_user_id, business_id, score) VALUES ($1, $2, $3) RETURNING id',
            [match_user_id, key, businessScoreCollection[key]]));
        });

        return Promise.all(insertQueries);
      }).then(resultSets => {
        res.json(resultSets);
      })

  },

  matchResult(req, res){

    const businessScoreCollection = {};

      p.query('SELECT business_id, sum(score) AS final_score FROM business_match GROUP BY business_id ORDER BY final_score DESC LIMIT 3')
      .then(result => {

      const queries = [];
      console.log(result);


      result.rows.map(r => {
        if(!(r.business_id in businessScoreCollection)){
          businessScoreCollection.business_id = r.final_score;
        }
        queries.push(p.query('SELECT * FROM BUSINESS WHERE id = $1', [r.business_id]));
      });
      return Promise.all(queries);
    }).then(results => {
        const _results = [];
        results.map( r => {
          _results.push({...r.rows[0], score: businessScoreCollection[`${r.rows[0].id}`]})
        })
        res.json( _results );
      })
  }

}
