import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../util/extractDetail';

import {
  handleCustomActionError,
  qNonEmpty,
  q,
} from '../../util/q';

import {
  UTTER_INIT_INFORM_RESPONDENT_NOT_FOUND,
  UTTER_SERVICE_REQUEST_RESPONSE
} from '../../../../constants/BotActions'

import { init_service_request_notification } from '../../../../constants/ReverseCmds';

export default async (body, epicId) => {


  const enquirerWxid = extractFromCustomAction.wxid(body);
  const enquirerRoomId = extractFromCustomAction.roomId(body);
  const [ category, flat, floor ] =
    extractFromCustomAction.slots(body, ['service', 'flat', 'floor']);
  const enquirerContactId = (await qNonEmpty('SELECT id from contact WHERE wxid = $1',
    [enquirerWxid])).rows[0].id;


  if(enquirerWxid === null ||  enquirerWxid === '' || category === null)
    return handleCustomActionError({message: 'error_bad_info'});

  let tagId= (await qNonEmpty('SELECT id from tag WHERE tag_name = $1',
    [category])).rows[0].id;


  await qNonEmpty('INSERT INTO match (enquirer_id, enquirer_room_id, tag_id, epic_id) VALUES ($1, $2, $3, $4) RETURNING id;',
    [ enquirerContactId, enquirerRoomId, tagId, epicId ]);

  /* dispatch to all potential respondents */
  const contactIdOfAllTargetsRows = (await q(
      'SELECT ct.contact_id FROM tag t ' +
      'INNER JOIN contact_tag ct ON ct.tag_id = t.id ' +
      'WHERE t.tag_name = $1',
      [category],
    )).rows;
 /*if (contactIdOfAllTargetsRows.length === 0)
      'dispatchServiceRequest.js utter_respondent_not_found'*/

  const contactIdOfFirstTarget = contactIdOfAllTargetsRows[0].contact_id;
  const wxidOfFirstTarget = (await qNonEmpty(
    'SELECT DISTINCT wxid FROM contact c WHERE id = $1',
    [ contactIdOfFirstTarget ]
  )).rows[0];
  const respondentWxid = (typeof wxidOfFirstTarget.wxid === 'string' && wxidOfFirstTarget.wxid.length > 0)
    ? wxidOfFirstTarget.wxid
    : null;
  if(respondentWxid === null) return handleCustomActionError({scope: 'rasa', message: 'dispatchServiceRequest.js wxid is null'});

  return {
    reply: {
      action: UTTER_SERVICE_REQUEST_RESPONSE,
    },
    reverseCommands: [{
      sender: respondentWxid,
      message:  init_service_request_notification(category, floor, flat)
    }]
  };
}
