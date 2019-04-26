import { ACTION_DEFAULT_FALLBACK } from '../../../../../constants/BotActions'

import  p from '../../../../../utils/agents';

module.exports = {
  handleError: (
    {
      scope = 'default',
      type = 'general_error',
      action = ACTION_DEFAULT_FALLBACK,
      message = ''
    }
  ) => {
    console.error(message);
    switch(scope){
      case 'rasa':
        return {
          reply: {
            action
          }
        };
        break;
      default:
        break;
    }
  },

  qNonEmpty: async (sql, params, errMetaData) => {
    await p.query(sql, params)
      .then(res => {
        if (res.rows.length === 0)
          throw new Error(errMetaData);
      })
      .catch(err => {
        throw err;
      })
  },

  extractEpicId: async(body) => {
    const { body } = req;
    const text = body.tracker.latest_message.text;
    return text.substr(0, text.indexOf('|'));
  }

}
