
import p from '../utils/agents';

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

let calculateMatchResultPromise = (matchId) => {

  /** fetch suggestions from all users **/

  let matchUserIds = [];

  let businessScoreCollection = {};


  let userPreferenceLists = [];

  let byCarCount;
  let freeParkingCount;

  let userAmount = 0;
  let sqrtUserAmount = 0;

  console.log('go');

  Promise.all(
    [
      p.query('SELECT SUM(CASE WHEN by_car = true THEN 1 END) AS by_car_count FROM match_user WHERE match_id = $1;', [matchId]),
      p.query('SELECT SUM(CASE WHEN free_parking = true THEN 1 END) AS free_parking_count FROM match_user WHERE match_id = $1;', [matchId]),
      p.query('SELECT id, budget_min, budget_max, foodsize_min, foodsize_max FROM match_user WHERE match_id = $1', [matchId]),
    ]
  ).then(results => {

    userAmount = results[2].rows.length;

    sqrtUserAmount = Math.sqrt(userAmount);

    byCarCount = results[0].rows[0].by_car_count;
    freeParkingCount = results[1].rows[0].free_parking_count;

    userPreferenceLists = results[2].rows;

    /** fetch tags in suggestions from all users **/

    let users = results[2].rows;

    users.map(u => {
      matchUserIds.push(u.id);
    });

    return Promise.all([
      p.query(
        'SELECT count(match_user_id) as counter FROM match_user_tag WHERE match_user_id = ANY($1::int[]) GROUP BY match_user_id ORDER BY match_user_id;',
        [matchUserIds]),
      p.query(
        'SELECT * FROM match_user_tag WHERE match_user_id = ANY($1::int[]) ORDER BY match_user_id;',
        [matchUserIds])
    ])

  }).then(results => {

    /** recalculate scores for business result **/

    let promises = [];

    let indexInAllRows = 0;

    results[0].rows.map((row, i) => {

      let queryVarNumber = 1;

      let buildFirstQueriesWithKeywords = '';
      let buildSecondQueriesWithKeywords = '';
      let buildQueriesWithEverything = '';
      let buildValuesWithEverything = [];

      let buildValuesWIthKeywords = [];

      for (let subIndexOfThisUser = 0; subIndexOfThisUser < row.counter; subIndexOfThisUser++){
        if (subIndexOfThisUser === 0) {
          buildFirstQueriesWithKeywords = `st.id = $${queryVarNumber}`;
          buildSecondQueriesWithKeywords = `st.tag_id = $${queryVarNumber}`;
          buildValuesWIthKeywords.push(results[1].rows[indexInAllRows].tag_id);
        } else {
          buildFirstQueriesWithKeywords = `${buildFirstQueriesWithKeywords} OR st.id = $${queryVarNumber}`;
          buildSecondQueriesWithKeywords = `${buildSecondQueriesWithKeywords} OR st.tag_id = $${queryVarNumber}`;
          buildValuesWIthKeywords.push(results[1].rows[indexInAllRows].tag_id);
        }
        queryVarNumber++;
        indexInAllRows++;
      }


      if (buildFirstQueriesWithKeywords.trim() !== '') {
        buildFirstQueriesWithKeywords = `WHERE ${buildFirstQueriesWithKeywords}`;
      }

      if (buildSecondQueriesWithKeywords.trim() !== '') {
        buildSecondQueriesWithKeywords = `WHERE ${buildSecondQueriesWithKeywords}`;
      }


      // -----------------------------------------------
      //case 3, geolocation / nearby by position
      /*
          const {pos} = row;

          let buildQueriesWithLocation = '';

          if (pos.lat !== null && pos.lon !== null) {
            buildQueriesWithLocation = `b.pos <@> point($${queryVarNumber}, $${queryVarNumber + 1}) < 5`;

            buildQueriesWithEverything = buildQueries(buildQueriesWithEverything, buildQueriesWithLocation);

            queryVarNumber = queryVarNumber + 2;

            buildValuesWithEverything = ([...buildValuesWithEverything, pos.lon, pos.lat]);
          }

*/
      // -----------------------------------------------
      //case 4, place / building / nearby by places


      // -----------------------------------------------
      //case 5, budget min, max

      let buildQueriesWithBudget = '';
      const buildValuesWithBudget = [];

      let budgetMin = row.budget_min;
      let budgetMax = row.budget_max;

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

      if (buildQueriesWithEverything.trim() !== '') {
        buildQueriesWithEverything = `WHERE ${buildQueriesWithEverything}`;
      }

      const keywordQuery = `SELECT ft.business_id, SUM(2) as final_score ` +
        `FROM business_tag ft INNER JOIN tag st on ft.tag_id = st.id ` +
        `${buildFirstQueriesWithKeywords} GROUP BY ft.business_id ${buildQueriesWithEverything}`;

      const favorQuery = `SELECT ft.business_id, SUM(st.score) as final_score ` +
        `FROM business_tag ft INNER JOIN user_tag st on ft.tag_id = st.tag_id ` +
        `${buildSecondQueriesWithKeywords} GROUP BY ft.business_id ${buildQueriesWithEverything}`;

      //-------

      promises.push(p.query(keywordQuery, buildValuesWIthKeywords));
      promises.push(p.query(favorQuery, buildValuesWIthKeywords));
    });

    return Promise.all(promises);

  }).then((results) => {

    console.log(results);


    /** add scores and sort result and save the sorting result **/



    for(let i = 0; i < results.length; i += 2){

      let queryScore = results[i].rows;
      let favorScore = results[i+1].rows;

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
    }

    let businessIdList = Object.keys(businessScoreCollection).map(Number);

    let params = [];
    for(let i = 1; i <= businessIdList.length; i++) {
      params.push('$' + i);
    }

    return p.query(`SELECT * FROM business WHERE id = ANY($1::int[]);`, [businessIdList]);

  }).then((result) => {

    let businesses = result.rows;

    let mustByCar = false;
    if (byCarCount > sqrtUserAmount) {
      mustByCar = true;
    }

    let mustFreeParking = false;
    if (freeParkingCount > sqrtUserAmount) {
      mustFreeParking = true;
    }

    let queryVarNumber = 1;

    let buildQueriesWithValues = [];
    let rowParamsArray = [];

    for (let b = 0; b < businesses.length; b++) {

      let business = businesses[b];

      let budgetConflict = 0;
      let foodsizeConflict = 0;
      let byCarConflict = 0;
      let freeParkingConflict = 0;

      if (!business.by_car) {
        if (mustByCar) {
          continue;
        }
        else {
          byCarConflict = byCarCount;
        }
      }

      if (!business.free_parking) {
        if (mustFreeParking) {
          continue;
        }
        else {
          freeParkingConflict = freeParkingCount;
        }

      }

      userPreferenceLists.map(u => {
        if (business.price < u.budget_min || business.price > u.budget_max) {
          budgetConflict++;
        }
        if (business.foodsize < u.foodsize_min || business.foodsize > u.foodsize_max) {
          foodsizeConflict++;
        }
      });
      if (budgetConflict >= sqrtUserAmount || foodsizeConflict >= sqrtUserAmount) {
        continue;
      }

      let paramsArray = [];

      for (let i = 0; i <= 6; i++) {
        paramsArray.push(`$${queryVarNumber + i}`);
      }
      queryVarNumber = queryVarNumber + 7;
      rowParamsArray.push(`(${paramsArray.join(',')})`);

      buildQueriesWithValues.push(
        matchId,
        business.id,
        businessScoreCollection[business.id],
        budgetConflict,
        foodsizeConflict,
        byCarConflict,
        freeParkingConflict
      );

    }
    console.log(rowParamsArray.join(','));

    return p.query(`INSERT INTO business_match (match_id, business_id, score, budget_conflict, foodsize_conflict, by_car_conflict, free_parking_conflict) VALUES ${rowParamsArray.join(',')} RETURNING id`,
      buildQueriesWithValues
    );
  })
};



export default {

  list(req, res) {
    p.query('SELECT * FROM match').then(
      results => {
        console.log(results);
        res.json({ matches: results.rows });
      });


  },

  createMatch(req, res, next) {

    let matchId;
    p.query('INSERT INTO match (creator_id, title, description) VALUES ($1, $2, $3) RETURNING id', ['U0000001', req.body.title, req.body.description]).then(
      results => {
        const { rows } = results;
        matchId = rows[0].id;

        return p.query('INSERT INTO  match_user (match_id, user_id, weight) VALUES ($1, $2, $3) RETURNING id;',
          [
            matchId,
            req.user.user_id,
            1
          ])
      }
    ).then( results => {
      res.json({matchId})
    }).catch(err =>{
      res.json(err);
    });

  },

  joinMatch(req, res){
    p.query('INSERT INTO match_user (match_id, user_id, weight) VALUES ($1, $2, $3) RETURNING id;',
      [
        req.params.id,
        req.user.user_id,
        1
      ]).then( results => {
      const { rows } = results;
      res.json({matchId: rows[0].id })

    }).catch(err =>{
      res.json(err);
    });
  },

  saveSuggestion(req, res){

    let matchId = req.params.id;

    /** insert and update user suggestion **/

    p.query('UPDATE TABLE match_user SET start_time = $1, end_time = $2, budget_min = $3, budget_max = $4, foodsize_min = $5, foodsize_max = $6, by_car = $7, free_parking = $8, pay_for_all = $9' +
      ' WHERE match_id = $10 AND user_id = $11 RETURNING id;',
      [
        req.body.startTime,
        req.body.endTime,
        req.body.budget.min,
        req.body.budget.max,
        req.body.foodSize.min,
        req.body.foodSize.max,
        req.body.parking.goByTransport,
        req.body.parking.freeParking,
        req.body.payForAll,
        matchId,
        req.user.user_id,

      ]).then( results => {

        let rowParamsArray = [];
        let buildValues = [];
        let queryVarNumber = 1;

      const {rows} = results;
      req.body.tags.map(t => {
        let paramsArray = [];
        for(let i = 0; i <= 1; i++) {
          paramsArray.push(`$${queryVarNumber + i}`);
        }
        queryVarNumber = queryVarNumber + 2;
        rowParamsArray.push(`(${paramsArray.join(',')})`);
        buildValues.push([rows[0].id, t.tag_id])
      });

      return p.query(`INSERT INTO match_user_tag (match_user_id, tag_id) VALUES ${rowParamsArray.join(',')}`);

    }).then(results => {

      res.json({matchId});

      calculateMatchResultPromise(matchId).then(() => {
        p.query('UPDATE match SET match_result_last_updated = current_timestamp;');
      });
    })

  },

  calculateMatchResult(req, res){
    calculateMatchResultPromise(req.params.id)
      .then(results => {
        p.query('UPDATE match SET match_result_last_updated = current_timestamp;');

        res.status(200).json({status: 'success'});

      });
  },

  matchResult(req, res){

    const businessScoreCollection = {};

      p.query('SELECT DISTINCT business_id, score, (by_car_conflict + free_parking_conflict + budget_conflict + foodsize_conflict) AS total_conflict FROM business_match WHERE match_id = $1 ORDER BY total_conflict ASC, score DESC;',
        [req.params.id])
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
        });
        res.json( _results );
      })
  },

  check(req, res) {
    let _story;

      p.query('SELECT * FROM match WHERE id = $1', [req.params.id]).then(
      (results) => {
        res.json(results);

    })
  },

}
