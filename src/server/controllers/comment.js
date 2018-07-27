import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    p.query('SELECT * FROM comment WHERE story_id = $1', [req.params.storyId]).then(
      results => res.json({comments: results.rows})
    )

  },

  check(req, res) {
    p.query('SELECT * FROM story WHERE id = $1', [req.params.id]).then(
      results => {
        const _story = results.rows;
        res.json({
          story: _story
        });
      });
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
            p.query('INSERT INTO tag (tag_id, tag_name, category) VALUES ($1, $2)', [tag_id, t, 'limitation']),
            p.query('INSERT INTO limitation_tag (limitation_id, tag_id) VALUES ($1, $2)', [limitation_id, tag_id])
          ])
        }
      )
    }
    if(typeof(req.body.goalTag) !== 'undefined' && req.body.goalTag.length > 0){
      req.body.goalTag.map(t => {
          const tag_id = uuidv4();
          goalTagsInsert.push([
            p.query('INSERT INTO tag (tag_id, tag_name, category) VALUES ($1, $2)', [tag_id, t, 'limitation']),
            p.query('INSERT INTO goal_tag (goal_id, tag_id) VALUES ($1, $2)', [goal_id, tag_id,])
          ])
        }
      )
    }
    Promise.all([
      p.query('INSERT INTO story (user_id, title) VALUES ($1, $2) RETURNING id',
        [req.user.user_id, req.body.title]),
      p.query('INSERT INTO goal (content) VALUES ($1) RETURNING id, content', [req.body.goal]),
      p.query('INSERT INTO limitation (content) VALUES ($1) RETURNING id, content', [req.body.limitation])
    ]).then(results =>
      Promise.all([
        p.query('INSERT INTO story_goal (story_id, goal_id) VALUES ($1, $2) RETURNING id',
          [results[0].id, results[1].id]),
        p.query('INSERT INTO story_limitation (story_id, limitation_id) VALUES ($1, $2)',
          [results[0].id, results[2].id]),
        ...limitationTagsInsert,
        ...goalTagsInsert
      ])
    ).then(results => {
      console.log(results[0].rows[0]);
      const {id} = results[0].rows[0];
      // const rows = results[4].rows;
      res.json({
        storyId: id
      });
    }).catch(err =>{
      console.log(err);
    });
  },

  update(req, res) {
    const modifiedStory = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM story WHERE story_id = ?", [req.params.id])
      .then( story => {
        story = assign(story, modifiedStory);
        return p.query("UPDATE TABLE story SET ?", [story])
      })
      .then( story => {
        res.json({
          originAttributes: req.body,
          user: story
        });
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Story WHERE story_id = ?", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
