import { ACTION_DEFAULT_FALLBACK } from '../../../constants/BotActions'

import  p from '../../../utils/agents';



const qNonEmpty = async (sql, params, errMetaData) => {

  return await p.query(sql, params)
    .then(res => {
      if (res.rows.length === 0) {
        console.log(errMetaData);
        throw new Error(errMetaData);
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

const handleCustomActionError = (
  {
    action = ACTION_DEFAULT_FALLBACK,
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
