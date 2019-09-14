import getDatabaseConfig from '../config/database';
import Errors from '../constants/Errors';

const { Pool } = require('pg');

import logger from './logger';

const databaseConfig = getDatabaseConfig(process.env.NODE_ENV);


class Agent {

  constructor(config) {

    console.log(config);

    this.pool = new Pool(config);
  }


  query(text, params){
    const start = Date.now();
    return new Promise((resolve, reject) => {
      this.pool.query(text, params, (err, res) => {
        const duration = Date.now() - start;
        logger.info('executed query %s', text);
        logger.verbose('%o', { duration, rows: res.rows })
        if (err) {
          logger.error(err);
          reject(err);
        }
        else{
          logger.info('Query execution success');
          resolve(res);
        }
      });
    })

  }

  transaction(bodyPromises, cb){
    return new Promise((resolve, reject) => {
      this.pool.connect((conErr, client, done) => {
        const errs = [];
        let results;
        const shouldAbort = tsError => {
          if (tsError) {
            console.log({...Errors.DB_OPERATION_FAIL, stack: tsError.stack});
            errs.pushError({...Errors.DB_OPERATION_FAIL, stack: tsError.stack});
            client.query('ROLLBACK')
              .then(() => {
                client.release();
                reject(errs);
              }).catch(rbError => {
              console.log({...Errors.DB_ROLLBACK_FAIL, stack: rbError.stack});
              errs.pushError({...Errors.DB_ROLLBACK_FAIL, stack: rbError.stack});
              reject(errs);
            });
          }
          return !!tsError
        };

        client.query('BEGIN')
            .then(res => new Promise((resu, reje) => bodyPromises(client, resu, reje)))
            .then(res => {

              results = res;
            })
            .then(client.query('COMMIT'))
            .then(() => {
              client.release();
              resolve(results);
            })
            .catch(error => shouldAbort(error));
      })
    })
  }

  getClient(callback){
    this.pool.connect((err, client, done) => {
      const query = client.query.bind(client);

      // monkey patch the query method to keep track of the last query executed
      client.query = (args) => {
        client.lastQuery = args;
        client.query(...args)
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000);

      const release = error => {
        // call the actual 'done' method, returning this client to the pool
        done(error);

        // clear our timeout
        clearTimeout(timeout);

        // set the query method back to its old un-monkey-patched version
        client.query = query
      };

      callback(err, client, done)
    })
  }
}

export default new Agent(databaseConfig.db);
