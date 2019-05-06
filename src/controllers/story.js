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

    let stories;

    p.query('SELECT * FROM story').then(
      results => {
        stories = results.rows;
        const userDetailsFetch = [];
        stories.map(({user_id}) =>
          userDetailsFetch.push(p.query('SELECT display_name, avatar_url FROM user_info WHERE user_id = $1', [user_id]))
        );
        return Promise.all(userDetailsFetch);
      }
    ).then(results => {
      const detailStories = stories.map((c, i) => Object.assign({}, c, results[i].rows[0]));
      console.log(detailStories);
      res.json({ stories: detailStories} )
    })

  },

  check(req, res) {
    let _story;
    Promise.all([
      p.query('SELECT * FROM story WHERE id = $1', [req.params.id]),
      p.query('SELECT * FROM story_goal WHERE story_id = $1', [req.params.id]),
      p.query('SELECT * FROM story_limitation WHERE story_id = $1', [req.params.id])
    ]).then(
      ([res1, res2, res3]) => {
        console.log('res2.rows');
        console.log(res2.rows);
        _story = res1.rows[0];
        return Promise.all([
          p.query('SELECT * FROM goal WHERE id = $1', [res2.rows[0].goal_id]),
          p.query('SELECT * FROM limitation WHERE id = $1', [res3.rows[0].limitation_id])
        ])

      }).then(([res1, res2]) => {
      const goal = res1.rows[0].content;
      const limitation = res2.rows[0].content;
      const finalresult = {..._story, goal, limitation};
      console.log('finalresult');
      console.log(finalresult);
      res.json({
        story: finalresult
      });
    })
  },

  create(req, res) {

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
      p.query('INSERT INTO story (user_id, title, v_budget, c_budget) VALUES ($1, $2, $3, $4) RETURNING id',
        [req.user.user_id, req.body.title, req.body.v_budget, req.body.c_budget]),
      p.query('INSERT INTO goal (content) VALUES ($1) RETURNING id, content', [req.body.goal]),
      p.query('INSERT INTO limitation (content) VALUES ($1) RETURNING id, content', [req.body.limitation])
    ]).then(results => {
      console.log(results[0]);
      console.log(results[1]);
      console.log(results[2]);
      return Promise.all([
        p.query('INSERT INTO story_goal (story_id, goal_id) VALUES ($1, $2) RETURNING story_id',
          [results[0].rows[0].id, results[1].rows[0].id]),
        p.query('INSERT INTO story_limitation (story_id, limitation_id) VALUES ($1, $2)',
          [results[0].rows[0].id, results[2].rows[0].id]),
        ...limitationTagsInsert,
        ...goalTagsInsert
      ])
    }).then(results => {
            console.log(results[0].rows[0]);
            const {story_id} = results[0].rows[0];
           // const rows = results[4].rows;
            res.json({
              storyId: story_id
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
