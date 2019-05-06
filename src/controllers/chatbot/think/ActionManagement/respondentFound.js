import p from '../../../../utils/agents';
import {
  qNonEmpty,

} from '../../util/q'
import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../util/extractDetail'
import { init_inform_respondent_found } from '../../../../constants/ReverseCmds'

import {
  Contact
} from 'Wechaty'
import bot from '../../bot';


const fetchMatchDetail = async (epicId) => {

  console.log(epicId);

  const result = (await qNonEmpty(
      'SELECT * FROM match m INNER JOIN epic e ON m.epic_id = e.id WHERE e.id = $1',
      [epicId])
  ).rows[0];

  console.log(result);

  const {
    id: matchId,
    tag_id: tagId,
    enquirer_room_id: enquirerRoomId,
    enquirer_id: enquirerContactId
  } = result;

  return {matchId, tagId, enquirerRoomId, enquirerContactId}
};

const respondentFound = async (body, epicId) => {

  const {
    matchId,
    tagId,
    enquirerRoomId,
    enquirerContactId
  } = await fetchMatchDetail(epicId);

  const respondentContactId = await extractFromCustomAction.contactId(body);

  /*update match respondent Id*/
  await p.query(
    'UPDATE match SET respondent_id = $1 WHERE id = $2',
    [respondentContactId, matchId]
  ).then(res => res).catch(err => {throw err});
  console.log(tagId);
  /* Get tag name and wxid of enquirer and send feedback to him */
  const tagName = (await qNonEmpty(
    'SELECT DISTINCT tag_name FROM tag WHERE id = $1',
    [tagId]
  )).rows[0].tag_name || '';

  const enquirerWxid = (await qNonEmpty(
    'SELECT wxid FROM contact WHERE id = $1', [enquirerContactId]
  )).rows[0].wxid || '';



  const sender = typeof enquirerRoomId === 'string' && enquirerRoomId.length > 0
    ? `${enquirerWxid}@${enquirerRoomId}`
    : enquirerWxid;

  const respondentWxid = (await qNonEmpty(
    'SELECT wxid FROM contact WHERE id = $1', [respondentContactId]
  )).rows[0].wxid || '';

  const contact = bot.Contact.load(respondentWxid);
  const respondentName = await contact.name(contact);

  console.log(sender);

  return {
    reply: {
      action: 'utter_thanks'
    },
    reverseCommands: [
      {
        sender: sender,
        message: init_inform_respondent_found(tagName, respondentName)
      }
    ]
  }
};

export default respondentFound;

