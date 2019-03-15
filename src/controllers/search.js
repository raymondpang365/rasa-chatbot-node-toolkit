
import p from '../utils/agents';

import { propValueArray } from '../utils/functions';

const uuidv4 = require('uuid/v4');


let buildQueries = (buildQueriesWithEverything, queryPart) => {

  if (buildQueriesWithEverything.trim() === '') {
    buildQueriesWithEverything = `${queryPart}`;
  }
  else{
    buildQueriesWithEverything = `(${buildQueriesWithEverything}) AND (${queryPart})`;
  }

  return buildQueriesWithEverything;
};

export default {

  testSearch(req, res){
    p.query("SELECT * FROM tag WHERE tag ==> dsl.match(field => 'tag_name', query => $1, analyzer => 'synonym')",
      [req.body.criteria]).then(result => {
        res.json(result);
    });



  },

  wordFilter(req, res, next){
    let matchedTags = [];

    console.log(req.body);

    if(req.body.word !== '') {
      p.query("SELECT * FROM tag WHERE tag ==> dsl.match(field => 'tag_name', query => $1, analyzer => 'synonym')",
        [req.body.word])
        .then(matchedTags => {
          matchedTags.map(kw => matchedTags.push(parseInt(kw.id)));
          req.matchedTags = matchedTags;
          console.log(matchedTags);
          next();
        })
    }
    else{
      req.matchedTags = matchedTags;
      console.log(matchedTags);
      next();
    }
  },


  search(req, res) {

    let queryScore;
    let favorScore;

    const allQueries = [];
    const businessScoreCollection = {};

    let buildQueriesWithEverything = '';
    let buildValuesWithEverything = [];

    const sortable = [];

    //----------------------------------------------
    // case 1 tags

    console.log(req.body);



    let buildValuesWithKeywords = [];

    let buildFirstQueriesWithKeywords = '';
    let buildSecondQueriesWithKeywords = '';

    let queryVarNumber = 1;

    let matchedTags = [...req.matchedTags, ...propValueArray(req.body.tag, 'tagId')];

    if (matchedTags.length > 0) {

      if(req.body.tag.length > 0) {
        buildFirstQueriesWithKeywords = `st.id = ANY($${queryVarNumber}::int[])`;
        buildSecondQueriesWithKeywords = `st.tag_id = ANY($${queryVarNumber}::int[])`;
        queryVarNumber++;
        buildValuesWithKeywords.push(matchedTags);
      }
    }

    // -----------------------------------------------
    // case 2 scores

    const aspectScores = req.body.score;

    const food_quality_score = aspectScores.foodQuality;
    const ambiance_score = aspectScores.ambiance;
    const service_score = aspectScores.service;
    const specialness_score = aspectScores.specialness;


    let buildQueriesWithScores = '';
    const buildValuesWithScores = [];

    if (food_quality_score > 0 || ambiance_score > 0 || service_score > 0 || specialness_score > 0) {
      const scores = {
        food_quality_score,
        ambiance_score,
        service_score,
        specialness_score
      };

      console.log(scores);

      Object.keys(scores).map((aspect, i) => {
        if(scores[aspect] > 0) {
          if (buildQueriesWithScores === '') {
            buildQueriesWithScores = `${aspect} >= $${queryVarNumber}`;
            queryVarNumber++;
            buildValuesWithScores.push(scores[aspect]);
          } else {
            buildQueriesWithScores = `${buildQueriesWithScores} AND ${aspect} >= $${queryVarNumber}`;
            queryVarNumber++;
            buildValuesWithScores.push(scores[aspect]);
          }
        }
      });


      buildQueriesWithEverything = buildQueries(buildQueriesWithEverything, buildQueriesWithScores);

      buildValuesWithEverything.push(...buildValuesWithScores);

    }

    // -----------------------------------------------
    //case 3, geolocation / nearby by position

    const {pos} = req.body;

    let buildQueriesWithLocation = '';
    const buildValuesWithLocation = [];

    if (pos.lat !== null && pos.lon !== null) {
      buildQueriesWithLocation = `b.pos <@> point($${queryVarNumber}, $${queryVarNumber + 1}) < 5`;

      buildQueriesWithEverything = buildQueries(buildQueriesWithEverything, buildQueriesWithLocation);

      queryVarNumber = queryVarNumber + 2;
      // buildValuesWithLocation.push(pos.lon, pos.lat);

      buildValuesWithEverything = ([...buildValuesWithEverything, pos.lon, pos.lat]);
    }

    // -----------------------------------------------
    //case 4, place / building / nearby by places


    // -----------------------------------------------
    //case 5, budget min, max

    let buildQueriesWithBudget = '';
    const buildValuesWithBudget = [];

    let budgetMin = req.body.budget.min;
    let budgetMax = req.body.budget.max;

    if (budgetMin > 0 || budgetMax < 10000) {
      if (budgetMin > 0) {
        buildQueriesWithBudget = `budget >= $${queryVarNumber}`;
        queryVarNumber++;
        buildValuesWithBudget.push(budgetMin);
      }
      if (budgetMax < 10000 && budgetMin > 0) {

        buildQueriesWithBudget = `${buildQueriesWithBudget} AND budget <= $${queryVarNumber}`;
        queryVarNumber++;
        buildValuesWithBudget.push(budgetMax);
      }
      else if (budgetMax < 10000) {
        buildQueriesWithBudget = `${buildQueriesWithBudget} AND budget <= $${queryVarNumber}`;
        queryVarNumber++;
        buildValuesWithBudget.push(budgetMax);
      }

      buildQueriesWithEverything = buildQueries(buildQueriesWithEverything, buildQueriesWithBudget);

      buildValuesWithEverything.push(...buildValuesWithBudget);
    }

    if (buildFirstQueriesWithKeywords.trim() !== '') {
      buildFirstQueriesWithKeywords = `WHERE ${buildFirstQueriesWithKeywords}`;
    }
    if (buildSecondQueriesWithKeywords.trim() !== '') {
      buildSecondQueriesWithKeywords = `WHERE ${buildSecondQueriesWithKeywords}`;
    }
    if (buildQueriesWithEverything.trim() !== '') {
      buildQueriesWithEverything = `WHERE ${buildQueriesWithEverything}`;
    }


    // -----------------------------------------------
    // combine query

    const searchTagsQuery = `SELECT *, final_score FROM business b INNER JOIN (SELECT ft.business_id as bizId, SUM(ft.score * 2) as final_score ` +
      `FROM business_tag ft INNER JOIN tag st on ft.tag_id = st.id ` +
      `${buildFirstQueriesWithKeywords} GROUP BY ft.business_id) AS smallT ON b.id = bizId ${buildQueriesWithEverything}`;

    const profileTagsQuery = `SELECT *, final_score FROM business b INNER JOIN (SELECT business_id as bizId, SUM(ft.score * st.score) as final_score ` +
      `FROM business_tag ft INNER JOIN user_tag st on ft.tag_id = st.tag_id ` +
      `${buildSecondQueriesWithKeywords} GROUP BY ft.business_id) AS smallT ON b.id = bizId ${buildQueriesWithEverything}`;

    allQueries.push(p.query(searchTagsQuery, [...buildValuesWithKeywords, ...buildValuesWithEverything]));
    allQueries.push(p.query(profileTagsQuery, [...buildValuesWithKeywords, ...buildValuesWithEverything]));

    Promise.all(allQueries).then(([res1, res2]) => {
      queryScore = res1.rows;
      favorScore = res2.rows;

      // -----------------------------------------------
      // sorting

      queryScore.map(qs => {

        const id = qs.id;

        if (id in businessScoreCollection) {
          businessScoreCollection[id] = {
            ...businessScoreCollection[id],
            final_score: businessScoreCollection[id].final_score + qs.final_score
          }

        }
        else {
          businessScoreCollection[id] = qs
        }
      });

      favorScore.map(fs => {
        if (fs.business_id in businessScoreCollection) {
          businessScoreCollection[id] = {
            ...businessScoreCollection[id],
            final_score: businessScoreCollection[id].final_score + qs.final_score
          }
        }
        else {
          businessScoreCollection[fs.business_id] = fs.final_score
        }
      });

      // vvv the following section may be irrelevant after the core processing id done
      // by elastic search. Because elasticsearch will do sorting automatically

      for (const biz in businessScoreCollection) {
        sortable.push(businessScoreCollection[biz]);
      }

      sortable.sort((a, b) => a.final_score - b.final_score);
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
        queryLists.push(p.query(`SELECT tag_name FROM tag INNER JOIN business_tag ON tag.id = business_tag.tag_id WHERE business_tag.business_id = $1`, [b.id]));
      });
      return Promise.all(queryLists);

    }).then(resultSets => {
      const results = [];

      let extendedBusinessInfo = [];

      resultSets.map((r, i) => {
        let tagList = [];

        r.rows.map(row => {
          tagList.push(row.tag_name);
        });
        extendedBusinessInfo.push({...sortable[i], tagList})
      });

      res.json({search: extendedBusinessInfo});
    });

  }
}
