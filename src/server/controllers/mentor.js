import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {


    let mentors;

    p.query('SELECT u.display_name, m.rating, t.name FROM (user_info u INNER JOIN mentor m ON (u.user_id = m.user_id)').then(
      results => {
        mentors = results.rows;
        const fetchTalents = [];
        mentors.map(m => fetchTalents.push(p.query('SELECT t.name FROM user_talents ut INNER JOIN talents t ON (ut.talents_id = t.id AND ut.user_id = $1)', [m.user_id])));
        console.log(mentors);
        res.json({mentors});
      });

  },

  check(req, res) {
    let _mentor;
    Promise.all([
      p.query('SELECT * FROM mentor WHERE id = $1', [req.params.id]),
      p.query('SELECT * FROM mentor_goal WHERE mentor_id = $1', [req.params.id]),
      p.query('SELECT * FROM mentor_limitation WHERE mentor_id = $1', [req.params.id])
    ]).then(
      ([res1, res2, res3]) => {
        console.log('res2.rows');
        console.log(res2.rows);
        _mentor = res1.rows[0];
        return Promise.all([
          p.query('SELECT * FROM goal WHERE id = $1', [res2.rows[0].goal_id]),
          p.query('SELECT * FROM limitation WHERE id = $1', [res3.rows[0].limitation_id])
        ])

      }).then(([res1, res2]) => {
      const goal = res1.rows[0].content;
      const limitation = res2.rows[0].content;
      const finalresult = {..._mentor, goal, limitation};
      console.log('finalresult');
      console.log(finalresult);
      res.json({
        mentor: finalresult
      });
    })
  },

  create(req, res) {
    console.log(req.body);
    const goal_id = uuidv4();
    const limitation_id = uuidv4();
    const limitationTagsInsert = [];
    const goalTagsInsert = [];
    if(typeof(req.body.limitationTag) !== 'undefined' && req.body.limitationTag.length > 0){
      req.body.limitationTag.map(t => {
          const tag_id = uuidv4();
          limitationTagsInsert.push([
            p.query('INSERT INTO tag (tag_id, tag_name, category) VALUES ($1, $2, $3)', [tag_id, t, 'limitation']),
            p.query('INSERT INTO limitation_tag (limitation_id, tag_id) VALUES ($1, $2)', [limitation_id, tag_id])
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
      p.query('INSERT INTO mentor (user_id, title, v_budget, c_budget) VALUES ($1, $2, $3, $4) RETURNING id',
        [req.user.user_id, req.body.title, req.body.v_budget, req.body.c_budget]),
      p.query('INSERT INTO goal (content) VALUES ($1) RETURNING id, content', [req.body.goal]),
      p.query('INSERT INTO limitation (content) VALUES ($1) RETURNING id, content', [req.body.limitation])
    ]).then(results => {
      console.log(results[0]);
      console.log(results[1]);
      console.log(results[2]);
      return Promise.all([
        p.query('INSERT INTO mentor_goal (mentor_id, goal_id) VALUES ($1, $2) RETURNING mentor_id',
          [results[0].rows[0].id, results[1].rows[0].id]),
        p.query('INSERT INTO mentor_limitation (mentor_id, limitation_id) VALUES ($1, $2)',
          [results[0].rows[0].id, results[2].rows[0].id]),
        ...limitationTagsInsert,
        ...goalTagsInsert
      ])
    }).then(results => {
      console.log(results[0].rows[0]);
      const {mentor_id} = results[0].rows[0];
      // const rows = results[4].rows;
      res.json({
        mentorId: mentor_id
      });
    }).catch(err =>{
      console.log(err);
    });
  },

  update(req, res) {
    const modifiedMentor = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM mentor WHERE mentor_id = ?", [req.params.id])
      .then( mentor => {
        mentor = assign(mentor, modifiedMentor);
        return p.query("UPDATE TABLE mentor SET ?", [mentor])
      })
      .then( mentor => {
        res.json({
          originAttributes: req.body,
          user: mentor
        });
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Mentor WHERE mentor_id = ?", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
