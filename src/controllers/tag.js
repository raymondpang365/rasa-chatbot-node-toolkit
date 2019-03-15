import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  list(req, res) {
    console.log(req.query);
    p.query('SELECT t.id as tag_id, * FROM tag t INNER JOIN tag_category tc ON t.category_id = tc.id WHERE tc.name = $1', [req.query.category]).then(
    results => {
      res.json({ tags: results.rows } )
    })
  },

  create(req, res) {
  },

  remove(req, res) {
    p.query("DELETE FROM Story WHERE story_id = $1", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
