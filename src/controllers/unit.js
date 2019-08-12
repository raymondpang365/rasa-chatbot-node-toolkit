import p from '../utils/agents';

const uuidv4 = require('uuid/v4');

export default {

  setValidAddress(req, res) {
    p.query('SELECT t.id as tag_id, * FROM tag t INNER JOIN tag_category tc ON t.category_id = tc.id WHERE tc.name = $1', [req.query.category]).then(
      results => {
        res.json({ tags: results.rows } )
      })
  },

};
