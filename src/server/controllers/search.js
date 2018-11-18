
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  testSearch(req, res){
    p.query("SELECT * FROM tag WHERE tag ==> dsl.match(field => 'tag_name', query => $1, analyzer => 'synonym')",
      [req.body.criteria]).then(result => {
        res.json(result);
    });

  },

  search(req, res) {

    let queryScore;
    let favorScore;

    const allQueries = [];

    const businessScoreCollection = {};

    const businessTagNameCollection = {};

    const food_quality = req.body.food_quality;
    const ambiance = req.body.ambiance;
    const service = req.body.service;
    const specialness = req.body.specialness;

    let buildFirstQueriesWithEverything = '';
    let buildSecondQueriesWithEverything = '';
    let buildValuesWithEverything = [];

    // -----------------------------------------------
    // full text search
    /*
    if ('criteria' in req.body) {
      p.query('SELECT * FROM story WHERE story ==>' +
        'dsl.match (' +
        'field article,' +
        'query text' +
        'RETURNS zdbquery').then(res => {
      })
    }
    */

    // -----------------------------------------------
    // tokenize, synonymize and find matched tag



    // -----------------------------------------------
    // case 1 scores


    let buildQueriesWithScores = '';
    const buildValuesWithScores = [];
    if (food_quality > 0 || ambiance > 0 || service > 0 || specialness > 0) {
      const scores = {
        food_quality,
        ambiance,
        service,
        specialness
      };

      Object.keys(scores).map((aspect, i) => {
        if (i === 0) {
          buildQueriesWithScores = `${aspect} >= $${i + 1}`;
          buildValuesWithScores.push(scores[aspect]);
        } else {
          buildQueriesWithScores = `${buildQueriesWithScores} ${aspect} >= $${i + 1}`;
          buildValuesWithScores.push(scores[aspect]);
        }
      });

      buildFirstQueriesWithEverything = buildQueriesWithScores;
      buildSecondQueriesWithEverything = buildQueriesWithScores;

      buildValuesWithEverything.push(buildValuesWithScores);

    }


    // -----------------------------------------------
    // case 2 keywords, get tag name

    let matchedTags = [];

    if ('criteria' in req.body) {
      p.query("SELECT * FROM tag WHERE tag ==> dsl.match(field => 'tag_name', query => $1, analyzer => 'synonym')",
        [req.body.criteria]).then(result => {
        res.json(result);
        matchedTags = result.rows;
      });
    }

    let buildValuesWithKeywords = [];

    let buildFirstQueriesWithKeywords = '';
    let buildSecondQueriesWithKeywords = '';

    if (matchedTags.length > 0) {

      matchedTags.map((kw, i) => {
        if (i === 0) {
          buildFirstQueriesWithKeywords = `st.id = $${i + 1}`;
          buildSecondQueriesWithKeywords = `st.tag_id = $${i + 1}`;
          buildValuesWithKeywords.push(kw.id);
        } else {
          buildFirstQueriesWithKeywords = `${buildFirstQueriesWithKeywords} OR st.id = $${i + 1}`;
          buildSecondQueriesWithKeywords = `${buildSecondQueriesWithKeywords} OR st.tag_id = $${i + 1}`;
          buildValuesWithKeywords.push(kw.id);
        }
      });

      buildFirstQueriesWithEverything = `(${buildFirstQueriesWithEverything}) AND (${buildQueriesWithScores})`;

      buildSecondQueriesWithEverything = `(${buildSecondQueriesWithEverything}) AND (${buildQueriesWithScores})`;

      buildValuesWithEverything.push(buildValuesWithScores);
    }


    // -----------------------------------------------
    // combine query

    const criteriaQuery = `SELECT ft.business_id, SUM(ft.score * 2) as final_score ` +
      `FROM business_tag ft INNER JOIN tag st on ft.tag_id = st.id WHERE ` +
      `${buildFirstQueriesWithEverything} GROUP BY ft.business_id`;

    const profileQuery = `SELECT business_id, SUM(ft.score * st.score) as final_score ` +
      `FROM business_tag ft INNER JOIN user_tag st on ft.tag_id = st.tag_id ` +
      `WHERE ${buildSecondQueriesWithEverything} GROUP BY ft.business_id`;

    allQueries.push(p.query(criteriaQuery, buildValuesWithEverything));
    allQueries.push(p.query(profileQuery, buildValuesWithEverything));


    Promise.all([
      allQueries,
      p.query('INSERT INTO search_history (keywords, user_id) VALUES ($1, $2) RETURNING id', [keywords, 'U0000001'])
    ]).then(([res1, res2]) => {

      console.log(res1.rows);
      console.log(res2.rows);


      queryScore = res1.rows;
      favorScore = res2.rows;

      // -----------------------------------------------
      // core processing: do elasticsearch here with keywords on document
      // plug in the above scoring as the boosting factor of the search

      queryScore.map(qs => {

        const id = qs.business_id;

        if (id in businessScoreCollection) {
          businessScoreCollection[id] += qs.final_score

        }
        else {
          businessScoreCollection[id] = qs.final_score
        }

        if (id in businessTagNameCollection) {
          businessTagNameCollection[id].push(qs.tagname)
        }
        else {
          businessTagNameCollection[id] = [qs.tagname]
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

      // vvv the following section may be irrelevant after the core processing id done
      // by elastic search. Because elasticsearch will do sorting automatically
      const sortable = [];
      for (const biz in businessScoreCollection) {
        sortable.push([biz, businessScoreCollection[biz]]);
      }

      sortable.sort((a, b) => a[1] - b[1]);
      console.log(sortable);

      // ^^^

      // -----------------------------------------------
      // post process action, (eg. filling)

      const resultLength = Object.keys(businessScoreCollection).length;


      if (resultLength < 10) {
        const extraResult = 10 - resultLength;


      }

      // -----------------------------------------------
      // retrieve full business information

      const queryLists = [];
      sortable.map(b => {
        queryLists.push(p.query('SELECT * FROM business WHERE id = $1', [b[0]]));
        queryLists.push(p.query('SELECT ft.business_id, st.tag_name FROM business_tag ft INNER JOIN tag st ON ft.tag_id = st.id WHERE ft.business_id = $1', [b[0]]))
      });


      return Promise.all(queryLists)

    }).then(resultSets => {


      const results = [];

      let id;
      let extendedBusinessInfo;

      resultSets.map((r, i) => {

        console.log(r.rows);

        if (i % 2 === 0) {

          id = r.rows[0].id;
          extendedBusinessInfo = r.rows[0];
        }
        else {

          const tagNameList = [];
          if (typeof id !== 'undefined') {
            r.rows.map(row => tagNameList.push(row.tag_name));

            extendedBusinessInfo = {...extendedBusinessInfo, tags: tagNameList};
            results.push(extendedBusinessInfo);
          }
        }

      });

      res.json({search: results});

    });
  }

}
