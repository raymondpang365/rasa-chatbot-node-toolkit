import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    // console.log(req);
    let comments;
    p.query('SELECT * FROM comment WHERE story_id = $1', [req.query.storyId]).then(
      results => {
        comments = results.rows;
        const userDetailsFetch = [];
        comments.map(({user_id}) =>
          userDetailsFetch.push(p.query('SELECT display_name, avatar_url FROM user_info WHERE user_id = $1', [user_id]))
        );
        return Promise.all(userDetailsFetch);
      }
    ).then(results => {
      const detailComments = comments.map((c, i) => Object.assign({}, c, results[i].rows[0]));
      res.json({ comments: detailComments} )
    })

  },

  addLikes(req,res){
    console.log(req.params.id);
    p.query('UPDATE comment SET likes = likes + 1 WHERE id = $1', [req.params.id]).then(
      results => {
        console.log(results.rows);
        const _story = results.rows;
        res.status(200).json({});
      });
  },


  create(req, res) {
    console.log(req.body);
    p.query('INSERT INTO comment (story_id, content, user_id) VALUES ($1, $2, $3) RETURNING story_id, content',
      [req.body.storyId, req.body.content, req.user.user_id]).then(results => {
      console.log(results.rows[0]);
      res.json(results.rows[0]);
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
