import p from '../../../../../utils/agents';
import {
  handleError,
  qNonEmpty
} from './handleError'

import {
  UTTER_INIT_INFORM_RESPONDENT_NOT_FOUND ,
  UTTER_SERVICE_REQUEST_RESPONSE
} from '../../../../../constants/BotActions'

import {  init_offer_job } from '../../../../../constants/reverseCmds';

export default async (params) => {

  const convId = (typeof params.sender === 'string') ? params.sender : '';
  const senderWxid = params.sender.contains('@') ? params.sender.split('@')[0] : convId;
  const senderRoomId = params.sender.contains('@') ? params.sender.split('@')[1] : null;
  const category = params.slots.service || null;
  const flat = params.slots.flat || null;
  const floor = params.slots.floor || null;

  if(senderWxid === null ||  senderWxid === '' || category === null)
    return handleError({message: 'error_bad_info'});

  let senderContactId = await qNonEmpty('SELECT DISTINCT id from contact WHERE wxid = $1',
    [senderWxid]).rows[0].id;

  const tagId = await qNonEmpty(
    'SELECT DISTINCT id from tag WHERE tag_name = $1', [category]
  ).rows[0].id;

  const matchId = await qNonEmpty('INSERT INTO match (enquirer_id, enquirer_room_id, tag_id) VALUES ($1, $2, $3) RETURNING id;',
    [senderContactId, senderRoomId, tagId]
  ).rows[0].id;

  const contactIdOfAllTargetsRows = await qNonEmpty(
      'SELECT ct.contact_id FROM tag t ' +
      'INNER JOIN contact_tag ct ON ct.tag_id = t.id ' +
      'WHERE t.tag_name = $1',
      [category],
      {
        action: UTTER_INIT_INFORM_RESPONDENT_NOT_FOUND,
        message: 'dispatchServiceRequest.js utter_respondent_not_found'
      }
    ).rows;

  const contactIdOfFirstTarget = contactIdOfAllTargetsRows[0].contact_id;

  const wxidOfFirstTarget = await qNonEmpty(
    'SELECT wxid FROM contact c WHERE id = $1',
    [ contactIdOfFirstTarget ]
  ).rows[0];

  const wxid = (typeof wxidOfFirstTarget.wxid === 'string' && wxidOfOneTarget.wxid.length > 0)
    ? wxidOfAllTargets.wxid
    : null;

  if(wxid === null) return handleError({scope: 'rasa', message: 'dispatchServiceRequest.js wxid is null'});

  return {
    reply: {
      action: UTTER_SERVICE_REQUEST_RESPONSE
    },
    reverseCommand: [{
      command:  init_offer_job(category, floor, flat),
      toContactId: contactIdOfFirstTarget,
      to: wxid,
      matchId
    }]
  };

}
