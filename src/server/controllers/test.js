import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

export default {

  list(req, res) {

    p.query('SELECT * FROM test').then(
      results => {
        let _tests = results.rows;
        if("page" in req.query && "limit" in req.query) {
          _tests = paginate(_tests, req.query.page, req.query.limit);
        }
        res.json({
          tests: _tests
        });
      });
  },

  check(req, res) {
    p.query('SELECT * FROM test WHERE id = $1', [req.params.id]).then(
      results => {
        const _test = results.rows;
        res.json({
          test: _test
        });
      });
  },

  create(req, res) {
    const test = { id: 1 };
    console.log(test);
    p.query('INSERT INTO test SET $1', test)
      .then(
        _test => {
          res.json({
            test: _test
          });
      });
  },

  update(req, res) {
    const modifiedTest = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM test WHERE test_id = ?", [req.params.id])
      .then( test => {
        test = assign(test, modifiedTest);
        return p.query("UPDATE TABLE test SET ?", [test])
      })
      .then( test => {
        res.json({
          originAttributes: req.body,
          user: test
        });
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Test WHERE test_id = ?", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
