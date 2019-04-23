import processLanguage from './processLanguage/rasa/rasaProcessor';
import dispatchWechatAction from './dispatchWechatAction';
import p from '../../../utils/agents';


export default async (payload) => {

  console.log(payload);
  let { fromId, roomId, text } = payload;

  let senderContactIdResult = await p.query('SELECT id FROM contact WHERE wxid = $1;',
    [fromId])
    .then(res => res).catch(err => console.log(err));

  if (senderContactIdResult.rows.length <= 0){
    senderContactIdResult = await p.query(
      'INSERT INTO contact (wxid) VALUES ($1) RETURNING id;',
      [fromId])
      .then(res => res).catch(err => console.log(err));
  }
  let senderContactId = senderContactIdResult.rows[0].id;

  await p.query(
    'INSERT INTO utterance (body, contact_id, room_id, bot, created_at) VALUES ' +
    '($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id;',
    [text,  senderContactId , roomId, false])
    .then(res => res)
    .catch(err => console.log(err));


  let messageFromBot = await processLanguage(payload);

  return await dispatchWechatAction(messageFromBot, senderContactId);

}
