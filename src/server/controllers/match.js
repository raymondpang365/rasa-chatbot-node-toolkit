
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
    p.query('INSERT INTO match (creator_id) VALUES $1 RETURNING id', ['U0000001']).then(
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

    const businessScoreCollection = {};

    console.log(req);

    const keywords = req.query.keywords.split(' ');

    let buildQueriesWIthKeywords = '';
    const buildValuesWIthKeywords = [];

    keywords.map((kw, i) => {
      if (i === 0) {
        buildQueriesWIthKeywords = `st.tag_name = $${i + 1}`;
        buildValuesWIthKeywords.push(kw);
      } else {
        buildQueriesWIthKeywords = `${buildQueriesWIthKeywords} OR st.tag_name = $${i + 1}`;
        buildValuesWIthKeywords.push(kw);
      }
    });

    const keywordQuery = `SELECT business_id, SUM(ft.score * st.score) as final_score` +
      `FROM business_tag ft LEFT JOIN tag st on ft.tag_id = st.tag_id WHERE` +
      `${buildQueriesWIthKeywords} GROUP BY ft.business_id`;

    const favorQuery = `SELECT business_id, SUM(ft.score * st.score) as final_score ` +
      `FROM business_tag ft LEFT JOIN user_tag st on ft.tag_id = st.tag_id ` +
      `WHERE ${buildQueriesWIthKeywords} GROUP BY ft.business_id`;


    Promise.all([
      p.query(keywordQuery, buildValuesWIthKeywords),
      p.query(favorQuery, buildValuesWIthKeywords),
      p.query('INSERT INTO match_user (match_id, user_id, weight) VALUES ($1, $2, $3)', [req.params.id, 'U0000001', 1])
    ]).then(
      ([res1, res2, res3]) => {
        queryScore = res1.rows;
        favorScore = res2.rows;

        queryScore.map(qs => {

          if (qs.businessId in businessScoreCollection) {
            businessScoreCollection[qs.business_id] *= qs.final_score
          }
          else {
            businessScoreCollection[qs.business_id] = qs.final_score
          }
        });

        favorScore.map(fs => {
          if (fs.business_id in businessScoreCollection) {
            businessScoreCollection[fs.business_id] *= fs.final_score
          }
          else {
            businessScoreCollection[fs.business_id] = fs.final_score
          }
        });

        const insertQueries = [];

        Object.keys(businessScoreCollection).forEach((key, index) => {

          insertQueries.push(p.query('INSERT INTO business_match (match_id, user_id, business_id, score) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.params.id, 'U0000001', key, businessScoreCollection[key]]));
        });

        return Promise.all(insertQueries);
      }).then(resultSets => {
        res.redirect('/matchresult/1');
        res.json(resultSets);
      })

  },

  matchResult(req, res){
      p.query('SELECT business_id, SUM(score) as final_score FROM business_match WHERE match_id = $1 GROUP BY business_id ORDER BY final_score DESC LIMIT 3',
        [req.params.id])
      .then(results => {

      const queries = [];

      results.map(r => {
        queries.push(p.query('SELECT * FROM BUSINESS WHERE business_id = $1', [r.business_id]));
      });
      return Promise.all(queries);
    }).then(results => {
        res.json( results );
      })
  }

}
