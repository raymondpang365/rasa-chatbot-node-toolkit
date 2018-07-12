import assign from 'object-assign';
import filterAttribute from '../utils/filterAttribute';

import paginate from '../utils/paginate';
import p from '../utils/agents';

export default {

  list(req, res) {
    Promise.all([
      p.query('SELECT t1.*, category_count FROM product t1 ' +
      'INNER JOIN (SELECT t2.category_id, COUNT(category_id) as category_count FROM product t2 WHERE business_id = $1' +
      'GROUP BY category_id) AS t3 ON t1.category_id = t3.category_id WHERE business_id = $1 ORDER BY t1.category_id',
        [1]),
      p.query('SELECT * FROM product_category WHERE business_id = $1 ORDER BY business_category_id',
        [1])
      ])
      .then(
        ([v1, v2]) => {
        let _products = v1.rows;
        const _categories = v2.rows;

        console.log(_products);
        const data = [];
        let i = 0;
        const  { length } = _products;
        while(i <= length - 1) {
          const { category_count } = _products[i];
          const categoryCount = parseInt(category_count, 10);
          console.log(categoryCount);
          const categoryData = _products.slice(i, i + categoryCount);
          data.push({
            category: _categories[_products[i].category_id - 1].category_name,
            data: categoryData
          });
          i += categoryCount;
        }

        if("page" in req.query && "limit" in req.query) {
          _products = paginate(_products, req.query.page, req.query.limit);
        }
        res.json({
          products: data
        });
      })
  },

  check(req, res) {
    p.query('SELECT * FROM product WHERE id = $1', [req.params.id]).then(
      results => {
        const _product = results.rows;
        res.json({
          product: _product
        });
      });
  },

  create(req, res) {
    const product = { id: 1 };
    console.log(product);
    p.query('INSERT INTO product SET $1', product)
      .then(
        _product => {
          res.json({
            product: _product
          });
      });
  },

  update(req, res) {
    const modifiedProduct = filterAttribute(req.body, ['text']);

    p.query("SELECT * FROM product WHERE product_id = ?", [req.params.id])
      .then( product => {
        product = assign(product, modifiedProduct);
        return p.query("UPDATE TABLE product SET ?", [product])
      })
      .then( product => {
        res.json({
          originAttributes: req.body,
          user: product
        });
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  remove(req, res) {
    p.query("DELETE FROM Product WHERE product_id = ?", [req.params.id]).then(() => {
      res.json({});
    });
  }
};
