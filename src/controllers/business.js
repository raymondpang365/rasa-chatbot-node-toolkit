import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    if('tag' in req.query){
      p.query('SELECT * FROM business b INNER JOIN business_tag bt ON b.id = bt.business_id WHERE bt.tag_id = $1', [req.query.tag]).then(
        results => {
          res.json({business: results.rows });
        });

    }
    else {
      p.query('SELECT * FROM business').then(
        results => {
          res.json({business: results.rows});
        });
    }
  },



  check(req, res) {
    let _business;
    Promise.all([
      p.query('SELECT * FROM business WHERE id = $1', [req.params.id]),
      p.query('SELECT * FROM business_goal WHERE business_id = $1', [req.params.id]),
      p.query('SELECT * FROM business_limitation WHERE business_id = $1', [req.params.id])
    ]).then(
      ([res1, res2, res3]) => {
        console.log('res2.rows');
        console.log(res2.rows);
        _business = res1.rows[0];
        return Promise.all([
          p.query('SELECT * FROM goal WHERE id = $1', [res2.rows[0].goal_id]),
          p.query('SELECT * FROM limitation WHERE id = $1', [res3.rows[0].limitation_id])
        ])

      }).then(([res1, res2]) => {
      const goal = res1.rows[0].content;
      const limitation = res2.rows[0].content;
      const finalresult = {..._business, goal, limitation};
      console.log('finalresult');
      console.log(finalresult);
      res.json({
        business: finalresult
      });
    })
  },

  create(req, res) {
    console.log(req.body);
    const goal_id = uuidv4();
    const business_id = uuidv4();
    const limitationTagsInsert = [];
    const goalTagsInsert = [];
    if(typeof(req.body.tag) !== 'undefined' && req.body.tag.length > 0){
      req.body.tag.map(t => {
          const tag_id = uuidv4();
          limitationTagsInsert.push([
            p.query('INSERT INTO tag (tag_id, tag_name) VALUES ($1, $2)', [tag_id, t]),
            p.query('INSERT INTO business_tag (business_id, tag_id) VALUES ($1, $2)', [business_id, tag_id])
          ])
        }
      )
    }
    if(typeof(req.body.goalTag) !== 'undefined' && req.body.goalTag.length > 0){
      req.body.goalTag.map(t => {
          const tag_id = uuidv4();
          goalTagsInsert.push([
            p.query('INSERT INTO tag (tag_id, tag_name, category) VALUES ($1, $2, $3)', [tag_id, t, 'limitation']),
            p.query('INSERT INTO goal_tag (goal_id, tag_id) VALUES ($1, $2)', [goal_id, tag_id,])
          ])
        }
      )
    }
    Promise.all([
      p.query('INSERT INTO business (user_id, title, v_budget, c_budget) VALUES ($1, $2, $3, $4) RETURNING id',
        [req.user.user_id, req.body.title, req.body.v_budget, req.body.c_budget]),
      p.query('INSERT INTO goal (content) VALUES ($1) RETURNING id, content', [req.body.goal]),
      p.query('INSERT INTO limitation (content) VALUES ($1) RETURNING id, content', [req.body.limitation])
    ]).then(results => {
      console.log(results[0]);
      console.log(results[1]);
      console.log(results[2]);
      return Promise.all([
        p.query('INSERT INTO business_goal (business_id, goal_id) VALUES ($1, $2) RETURNING business_id',
          [results[0].rows[0].id, results[1].rows[0].id]),
        p.query('INSERT INTO business_limitation (business_id, limitation_id) VALUES ($1, $2)',
          [results[0].rows[0].id, results[2].rows[0].id]),
        ...limitationTagsInsert,
        ...goalTagsInsert
      ])
    }).then(results => {
      console.log(results[0].rows[0]);
      const {business_id} = results[0].rows[0];
      // const rows = results[4].rows;
      res.json({
        businessId: business_id
      });
    }).catch(err =>{
      console.log(err);
    });
  },

  update(req, res) {
    const modifiedBusiness = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM business WHERE business_id = ?", [req.params.id])
      .then( business => {
        business = assign(business, modifiedBusiness);
        return p.query("UPDATE TABLE business SET ?", [business])
      })
      .then( business => {
        res.json({
          originAttributes: req.body,
          user: business
        });
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Business WHERE business_id = ?", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
