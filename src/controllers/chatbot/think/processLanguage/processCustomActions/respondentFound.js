import p from '../../../../../utils/agents';
import {
  qNonEmpty
} from './handleError'

import { init_inform_respondent_found } from '../../../../../constants/ReverseCmds'

const respondentFound = async (decision, text, senderContactId, fromId, previousUtteranceId) => {

  /**
   *  Todo:
   *  change fetchMatch to fetching match id from epic id
   */



  const fetchMatch = await qNonEmpty(
    'SELECT * FROM match WHERE respondent_utterance_id = $1',
    [previousUtteranceId])
    .rows[0];

  const tagId = fetchMatch.tag_id;
  const matchId = fetchMatch.id;
  const enquirerRoomId = fetchMatch.enquirer_room_id;
  const enquirerContactId = fetchMatch.enquirer_id;

  const tagName = await qNonEmpty(
    'SELECT DISTINCT tag_name FROM tag WHERE id = $1',
    [tagId]
    ).rows[0].name || '';

  await p.query('UPDATE match SET respondent_id = $1 WHERE id = $2',
    [senderContactId, matchId]
  ).then(res => res).catch(err => {throw err} );

  let enquirerWxid = await qNonEmpty(
    'SELECT wxid FROM contact WHERE id = $1', [enquirerContactId]
  ).rows[0].wxid || '';

  return {
    reply: {
      action: 'utter_thanks'
    },
    reverseCommand: [
      {
        message: init_inform_respondent_found(tagName, 'someone'),
        to: enquirerWxid,
        room: enquirerRoomId || undefined,
        toContactId: enquirerContactId
      }
    ]
  }
};

export default respondentFound;

