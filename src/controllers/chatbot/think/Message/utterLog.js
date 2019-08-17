import {
  q,
  qNonEmpty,
} from '../../util/q';

import {
  BOT_MESSAGE as extractFromBotMessage
} from '../../util/extractDetail'

import getExtraAction from '../../initiate/util/getExtraAction';

import logger from '../../../../utils/logger';


  /**
   *  Used in:
   *  ActionManagement/manager/index before processMessage in botInitChat
   *
   */
export const userUtterLog = async (fromId, roomId, text)=>{
  const senderContactIdResultRows = (await q('SELECT id FROM contact WHERE wxid = $1;',
    [fromId])).rows;

  const senderContactId = (senderContactIdResultRows.length <= 0)
    ? (await qNonEmpty(
      'INSERT INTO contact (wxid) VALUES ($1) RETURNING id;',
      [fromId])).rows[0].id
    : senderContactIdResultRows[0].id;
  console.log('fuck you');
  if(typeof roomId === 'undefined' || roomId === '') roomId = null;
  console.log(typeof roomId)
  console.log(null)
  console.log('fffdfdfdfdsfsdfsdfdsfsfsgsdgsgdgfdgdfgdfgdfgdfgdfgdgdfgdfgdgdfgdgdfgdfgdgdf')
  return (await qNonEmpty(
    'INSERT INTO utterance (body, contact_id, room_id, is_bot_to_user, created_at) VALUES ' +
    '($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id;',
    [text,  senderContactId , roomId, false ])).rows[0].id;
};

export const updateUserUtterLogEpicId = async (utteranceId, stage3_EpicId) => {
  console.log(utteranceId);
  console.log(stage3_EpicId);
  if(utteranceId !== 0)
    return await qNonEmpty(
      'UPDATE utterance u SET epic_id = $1 WHERE id = $2 RETURNING id;',
      [stage3_EpicId, utteranceId]
    );
};

  /**
   *  Used in:
   *  ActionManagement/manager/index after processMessage in botInitChat
   *
   */

export const botUtterLog = async (wechatActions, stage3_EpicId) => {
    if (typeof wechatActions !== 'undefined' && !Array.isArray(wechatActions))
      wechatActions = [wechatActions];

    await Promise.all(
      wechatActions.map(async a => {

        console.log(a);
        console.log('Line 61 Utterlog')

        console.log(a.text);


        let botUtterId;

        if(typeof a.to === 'string' && a.to.length > 0) {

          botUtterId = (await qNonEmpty('INSERT INTO utterance (contact_id, body, room_id, epic_id, is_bot_to_user, created_at) ' +
            'SELECT c.id, $1, $2, $3, $4, CURRENT_TIMESTAMP FROM contact c WHERE wxid = $5 RETURNING id;',
            [a.text, null, stage3_EpicId, true, a.to])).rows[0].id;
        }
        else{
          botUtterId = (await qNonEmpty('INSERT INTO utterance (contact_id, body, room_id, epic_id, is_bot_to_user, created_at) ' +
            'VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id;',
            [null, a.text,  a.room, stage3_EpicId, true])).rows[0].id;
        }

        const userUtterId = await extractFromBotMessage.utteranceId(a);

        if(!isNaN(botUtterId) && !isNaN(userUtterId)) {
          await q('UPDATE affirmation SET bot_utterance_id = $1 WHERE utterance_id = $2', [botUtterId, userUtterId]);
        }
        return botUtterId;
      })
    );
  };




