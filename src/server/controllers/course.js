import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    p.query('SELECT course_code, title, avg_gpa, avg_workload FROM course').then(
      results => {
        res.json({courses: results.rows });
      });
  },

  check(req, res) {
    let _course;
    Promise.all([
      p.query('SELECT * FROM course WHERE id = $1', [req.params.id]),
      p.query('SELECT * FROM course_goal WHERE course_id = $1', [req.params.id]),
      p.query('SELECT * FROM course_limitation WHERE course_id = $1', [req.params.id])
    ]).then(
      ([res1, res2, res3]) => {
        console.log('res2.rows');
        console.log(res2.rows);
        _course = res1.rows[0];
        return Promise.all([
          p.query('SELECT * FROM goal WHERE id = $1', [res2.rows[0].goal_id]),
          p.query('SELECT * FROM limitation WHERE id = $1', [res3.rows[0].limitation_id])
        ])

      }).then(([res1, res2]) => {
      const goal = res1.rows[0].content;
      const limitation = res2.rows[0].content;
      const finalresult = {..._course, goal, limitation};
      console.log('finalresult');
      console.log(finalresult);
      res.json({
        course: finalresult
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
      p.query('INSERT INTO course (user_id, title, v_budget, c_budget) VALUES ($1, $2, $3, $4) RETURNING id',
        [req.user.user_id, req.body.title, req.body.v_budget, req.body.c_budget]),
      p.query('INSERT INTO goal (content) VALUES ($1) RETURNING id, content', [req.body.goal]),
      p.query('INSERT INTO limitation (content) VALUES ($1) RETURNING id, content', [req.body.limitation])
    ]).then(results => {
      console.log(results[0]);
      console.log(results[1]);
      console.log(results[2]);
      return Promise.all([
        p.query('INSERT INTO course_goal (course_id, goal_id) VALUES ($1, $2) RETURNING course_id',
          [results[0].rows[0].id, results[1].rows[0].id]),
        p.query('INSERT INTO course_limitation (course_id, limitation_id) VALUES ($1, $2)',
          [results[0].rows[0].id, results[2].rows[0].id]),
        ...limitationTagsInsert,
        ...goalTagsInsert
      ])
    }).then(results => {
      console.log(results[0].rows[0]);
      const {course_id} = results[0].rows[0];
      // const rows = results[4].rows;
      res.json({
        courseId: course_id
      });
    }).catch(err =>{
      console.log(err);
    });
  },

  update(req, res) {
    const modifiedCourse = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM course WHERE course_id = ?", [req.params.id])
      .then( course => {
        course = assign(course, modifiedCourse);
        return p.query("UPDATE TABLE course SET ?", [course])
      })
      .then( course => {
        res.json({
          originAttributes: req.body,
          user: course
        });
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Course WHERE course_id = ?", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
