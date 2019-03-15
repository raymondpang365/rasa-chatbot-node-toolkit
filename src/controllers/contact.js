import p from '../utils/agents';

export default {

  list(req, res) {

    let sresults;

    p.query('SELECT * FROM contact').then(results => {
      res.json({ contacts: results} )
    })

  },

  suggest(req, res) {

  }
};
