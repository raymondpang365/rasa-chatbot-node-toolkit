import { UTTER_INTERNAL_SERVER_ERROR } from '../../constants/BotActions'

import  p from '../../utils/agents';



const qNonEmpty = async (sql, params, errMetaData) => {

  return await p.query(sql, params)
    .then(res => {
      if (res.rows.length === 0) {
       // console.log(errMetaData);
        throw new Error('No rows found');
      }
      return res;
    })
    .catch(err => {
      throw err;
    })
};

const q = async (sql, params) => {

  return await p.query(sql, params)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    })
};


function insertData(item,callback) {
  q('INSERT INTO subscriptions (subscription_guid, employer_guid, employee_guid)' +
  'values ($1,$2,$3)', [
  item.subscription_guid,
    item.employer_guid,
    item.employee_guid
],
  function(err,result) {
    // return any err to async.each iterator
    callback(err);
  })
}


const handleCustomActionError = (
  {
    action = UTTER_INTERNAL_SERVER_ERROR,
    message = ''
  }
  ) => {
    console.log(message);
    return {
      reply: {
        action
      }
    };
  };


module.exports = {
  q,
  qNonEmpty,
  handleCustomActionError
}
