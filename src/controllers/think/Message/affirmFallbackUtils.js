import { q, qNonEmpty } from '../../util/q';
import { updateUserUtterLogEpicId } from './utterLog';
import { USER_MESSAGE } from '../../util/extractDetail'

import logger from '../../../utils/logger'

export default {
  checking: async (payload, utteranceId) => {
    try {
      const contactId = await USER_MESSAGE.contactId(payload);
      const roomId = USER_MESSAGE.roomId(payload);

      const lastAffirmationRows = roomId === null
        ? (await q(
          `SELECT a.id, a.utterance_id, a.bot_utterance_id, a.intent_name FROM affirmation a INNER JOIN utterance u
          ON a.utterance_id = u.id
          WHERE u.contact_id = $1 AND u.room_id ISNULL AND a.affirmed = false ORDER BY u.created_at DESC LIMIT 1`,
          [contactId]
        )).rows
        : (await q(
        `SELECT a.id, a.utterance_id, a.bot_utterance_id, a.intent_name FROM affirmation a INNER JOIN utterance u
        ON a.utterance_id = u.id 
        WHERE u.contact_id = $1 AND u.room_id = $2 AND a.affirmed = false ORDER BY u.created_at DESC LIMIT 1`,
        [contactId, roomId]
      )).rows;


      if (lastAffirmationRows.length === 1) {
        const {
          id: affirmationId,
          utterance_id: oldUtteranceId,
          bot_utterance_id: botAskAffirmUtteranceId,
          intent_name: intent
        } = lastAffirmationRows[0];
        await qNonEmpty('UPDATE affirmation SET affirmed = true WHERE id = $1 RETURNING id', [affirmationId]);


        return {
          oldUserUtteranceId: oldUtteranceId,
          botAskAffirmUtteranceId: botAskAffirmUtteranceId,
          messageToBeSent: `/${intent}{"utterance_id":"${oldUtteranceId}","epic_id":"0"}`
        }
      }
      else{
        return {
          messageToBeSent: `0 e ${utteranceId} u| ${payload.message}`,
          oldUserUtteranceId : -1,
          botAskAffirmUtteranceId: -1
        }
      }
    }
    catch(err){
      logger.error(err);
    }

  },
  updateOldConversationEpicId: async (oldUserUtteranceId, botAskAffirmUtteranceId, epicId) => {
    const promises = [];
    if(!isNaN(oldUserUtteranceId) && oldUserUtteranceId > 0) {
      promises.push(await updateUserUtterLogEpicId(oldUserUtteranceId, epicId));
    }
    if(!isNaN(botAskAffirmUtteranceId) && botAskAffirmUtteranceId > 0) {
      promises.push(await updateUserUtterLogEpicId(botAskAffirmUtteranceId, epicId));
    }

    await Promise.all(promises)
        .then(res => res)
        .catch(err => {throw  err});
  }
}
