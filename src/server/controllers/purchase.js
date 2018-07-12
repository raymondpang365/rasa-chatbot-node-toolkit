import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';
import Errors from '../../constants/Errors';

import paginate from '../utils/paginate'
import p from '../utils/agents'

export default {

  list(req, res) {
    let exp = [];
    p.query(
      'SELECT * FROM purchase WHERE exp_id = $1',
      [1]
    ).then(result => {
      const promises = [];
      if (result.rowCount > 0) {
        exp = result.rows;
        console.log('exp');
        console.log(exp);
        result.rows.map(purchase => {
          promises.push(
            p.query(
              'SELECT * FROM product WHERE product_id = $1',
              [purchase.product_id]
            )
          );
        });
      }
      return Promise.all(promises);
    }).then( results => {
      if (exp === []) {
        res.json({status: 200, data: exp });
      }
      else {
        results.map((result, i) => {
          const productFound = result.rows;
          const {product_id, name_en, name_zh} = productFound[0];
          const product = {product_id, name_en, name_zh};
          console.log(product);
          exp[i].product = product;
          delete exp[i].product_id;
        });
        if ("page" in req.query && "limit" in req.query) {
          exp = paginate(exp, req.query.page, req.query.limit);
        }
        console.log(exp);
        res.json({status: 200, data: exp});
      }
    }).catch(error => {
      res.pushError(error);
      res.errors();
    });
  },

  checkLatest(req, res){
    let latestValidatedKit;
    p.query(
      'SELECT * FROM Kit WHERE user_id = ? AND date_validate = (SELECT MAX(date_validate) as date_validate FROM Kit WHERE user_id = ?)',
      [req.user.user_id, req.user.user_id]

    ).then(results => {
      [ latestValidatedKit ] = results;
      return p.query(
        'SELECT * FROM Test WHERE test_id = ?', [latestValidatedKit.test_id]
      );

    }).then(results => {
      const { test_id, name_en, name_zh} = results[0];
      const test = { test_id, name_en, name_zh };

      latestValidatedKit.test = test;
      delete latestValidatedKit.test_id;
      res.status(200).json({status:200, data: latestValidatedKit});

    }).catch(err => {
      res.status(500).json({status:500, err});
    })
  },

  check(req, res) {
    let kit;
    p.query(
      `SELECT id, serialnumber, testcode, test_id, user_id, status_id` +
      ` FROM Kit WHERE testcode = ?`,
      [req.params.testcode]
    ).then( row => {
      [ kit ] = row;
      if(kit.status_id > 0 && (req.user === undefined || kit.user_id !== req.user.user_id)) {
        throw Errors.USER_UNAUTHORIZED;
      }
      return p.query('SELECT * FROM Test WHERE test_id = ?', [kit.test_id]);
    }).then( row => {
      delete kit.test_id;
      [ kit.test ] = row;
      res.send({status: 200, data: { kit } });

    }).catch(error => {
      res.pushError(error);
      res.errors();
    });
  },

  bind(req, res){
    p.query(
      'UPDATE Kit SET user_id=?, date_validate=?, status_id=1 WHERE testcode=?',
      [req.user.user_id, new Date(), req.params.testcode]
    ).then(results => {
      if(results.affectedRows > 0) {
        console.log(200);
        res.status(200).json({status: 200, data: results});
      }
      else{
        console.log(400);
        res.status(400).json({status: 400, data: results});
      }
    }).catch(errors => {
      res.pushError(Errors.ODM_OPERATION_FAIL);
      res.errors();
    });
  },

  create(req, res) {
    const kit = { id: 1 };
    p.query('INSERT INTO Kit SET ?', kit).then(
      _kit => {
        res.json({
          kit: _kit
        });
      });
  },

  update(req, res) {
    const modifiedKit = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM Kit WHERE testcode = ?", [req.params.id])
      .then( kit => {
        kit = assign(kit, modifiedKit);
        return p.query("UPDATE TABLE Kit SET ?", [kit])
      })
      .then( _kit => {
        res.json({
          originAttributes: req.body,
          kit: _kit
        });
      })
      .catch( err => {
        res.pushError(err);
        res.errors();
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Kit WHERE testcode = ?", [req.params.id]).then(
      res.json({})
    )

  }
};
