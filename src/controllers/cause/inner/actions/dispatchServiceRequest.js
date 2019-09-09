import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../../util/extractDetail';

import {
  handleCustomActionError,
  qNonEmpty,
  q,
} from '../../../util/q';

import BotWrapper from '../../outer/BotWapper';

import {
  UTTER_INIT_NOTIFY_RESPONDENT_NOT_FOUND,
  UTTER_SERVICE_REQUEST_RESPONSE,
  UTTER_INVALID_SERVICE
} from '../../../../constants/BotActions'

import { init_service_request_notification } from '../../../../constants/ReverseCmds';

export default async (body, epicId) => {


  const enquirerWxid = extractFromCustomAction.wxid(body);
  const enquirerRoomId = extractFromCustomAction.roomId(body);
  const [ category, address ] =
    extractFromCustomAction.slots(body, ['service', 'address']);
  const enquirerContactId = (await qNonEmpty('SELECT id from contact WHERE wxid = $1',
    [enquirerWxid])).rows[0].id;

  if(enquirerWxid === null ||  enquirerWxid === ''){
    return handleCustomActionError({message: 'error_bad_info'});
  }
  else if(category === null)
    return handleCustomActionError({action: UTTER_INVALID_SERVICE, message: 'error_bad_info'});

  let tagId= (await qNonEmpty('SELECT id from tag WHERE tag_name = $1',
    [category])).rows[0].id;


  await qNonEmpty('INSERT INTO match (enquirer_id, enquirer_room_id, tag_id, epic_id) VALUES ($1, $2, $3, $4) RETURNING id;',
    [ enquirerContactId, enquirerRoomId, tagId, epicId ]);


  const contact = BotWrapper.bot.Contact.load(enquirerWxid);
  const enquirerName = await contact.name(contact);
  const message = init_service_request_notification(category, address, enquirerName);


  /* dispatch to all potential respondents */
  const contactIdOfAllTargetsRows = (await q(
      'SELECT ct.contact_id FROM tag t ' +
      'INNER JOIN contact_tag ct ON ct.tag_id = t.id ' +
      'WHERE t.tag_name = $1 AND ct.contact_id <> $2',
      [category, enquirerContactId],
    )).rows;

  console.log(contactIdOfAllTargetsRows);

  const findWxidQueryPromises = contactIdOfAllTargetsRows.map(async c => {
    console.log(c);
    return (await qNonEmpty(
      'SELECT DISTINCT wxid FROM contact c WHERE id = $1',
      [ c.contact_id ]
    ))
  });

  const findWxidQueryPromisesResult = await Promise.all(findWxidQueryPromises);

  const reverseCommands = findWxidQueryPromisesResult.map(r => {
    return {
      sender: r.rows[0].wxid,
      message
    }
  });

  return {
    reply: {
      action: UTTER_SERVICE_REQUEST_RESPONSE,
      slots: {
        enquirer: enquirerName
      }
    },
    reverseCommands
  };
}
