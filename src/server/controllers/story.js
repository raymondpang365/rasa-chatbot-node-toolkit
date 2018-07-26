import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    /*
    Promise.all([
      p.query('SELECT t1.*, category_count FROM story t1 ' +
      'INNER JOIN (SELECT t2.category_id, COUNT(category_id) as category_count FROM story t2 WHERE business_id = $1' +
      'GROUP BY category_id) AS t3 ON t1.category_id = t3.category_id WHERE business_id = $1 ORDER BY t1.category_id',
        [1]),
      p.query('SELECT * FROM story_category WHERE business_id = $1 ORDER BY business_category_id',
        [1])
      ])
      .then(
        ([v1, v2]) => {
        let _stories = v1.rows;
        const _categories = v2.rows;

        console.log(_stories);
        const data = [];
        let i = 0;
        const  { length } = _stories;
        while(i <= length - 1) {
          const { category_count } = _stories[i];
          const categoryCount = parseInt(category_count, 10);
          console.log(categoryCount);
          const categoryData = _stories.slice(i, i + categoryCount);
          data.push({
            category: _categories[_stories[i].category_id - 1].category_name,
            data: categoryData
          });
          i += categoryCount;
        }

        if("page" in req.query && "limit" in req.query) {
          _stories = paginate(_stories, req.query.page, req.query.limit);
        }
        res.json({
          stories: data
        });
      })
      */
    p.query('SELECT * FROM story').then(
      results => res.json({stories: results.rows})
    )

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

  check(req, res) {
    p.query('SELECT * FROM story WHERE id = $1', [req.params.id]).then(
      results => {
        const _story = results.rows;
        res.json({
          story: _story
        });
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
