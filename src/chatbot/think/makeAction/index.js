import p from '../../../utils/agents';

import dispatchJob from './dispatchJob';

import fallback from './fallback';

import yes_no from './yes_no';

const makeAction = async (decision, payload, senderContactId, utteranceId) => {

  const action = decision.action;

  const {fromId, text} = payload;



  let res1 = await p.query(
    'SELECT u1.* FROM utterance u1 WHERE (u1.created_at, u1.contact_id) IN ' +
    '(SELECT MAX(u2.created_at), u2.contact_id FROM utterance u2 ' +
    'WHERE u2.contact_id = $1 AND u2.bot=true GROUP BY u2.contact_id)',
    [senderContactId])
    .then(async res => res).catch(err => console.log(err));

  /**
   Handle possible feedback
   */
  console.log('starting1');
  console.log(fromId);
  console.log(senderContactId);
 console.log(res1.rows[0]);
  console.log(res1.rows.length > 0);
  //console.log('flag' in res1.rows[0]);
  console.log(action);
  console.log(text);
  console.log('ending1');

  let response;
  if (res1.rows.length > 0 && 'flag' in res1.rows[0]) {
    const {flag} = res1.rows[0];
    console.log('starting2');
    console.log(res1.rows[0].flag);
    console.log(flag);
    console.log('ending2');

    switch (flag) {
      case 'yes_no': // when only two options
        if (action === 'yes_no' || text === 'A' || text === 'B'
          || text === 'a' || text === 'b') {
          console.log('arrived');
          response = await yes_no(decision, text, senderContactId, fromId, res1.rows[0].id);
        }
        else{
          response = {
            action: 'fallback'
          };
        }
        break;
      /*
    case 'multiple_choice': //more than two options
      if(action === 'multiple_choice') {
        const response = await multipleChoice(decision, m);
        return response;
      }
      break; */
      default:
        response = {
          action: 'fallback'
        };
        break;
    }
    console.log('starting3');
    console.log(action);
    console.log(response);
    console.log('ending3');
    if (response.action !== 'fallback') {
      return response;
    }
  }

  /**
   Handle new issue
   */

  switch (action) {
    case 'dispatch':
      try {
        response = await dispatchJob(decision, senderContactId, res1.rows[0].room_id, utteranceId);
        console.log('makeAction/index.js');
      }
      catch (err) {
        throw err;
      }
      break;
    default:
      response = {
        action: 'fallback'
      };
      break;
  }
  if (response.action === 'fallback') {
    response = await fallback();
  }
  return response;

};

export default makeAction;
