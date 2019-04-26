import processLanguage from './processLanguage/rasaProcessor';
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
    'INSERT INTO utterance (body, contact_id, room_id, created_at) VALUES ' +
    '($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id;',
    [text,  senderContactId , roomId])
    .then(res => res)
    .catch(err => console.log(err));


  let botMessages = await processLanguage(payload);
  console.log('botMessages')
  console.log(botMessages);
  console.log('botMessages')
  let fullWechatActions = [];

  botMessages.map(m => {
    fullWechatActions.push({
      action: 'reply',
      ...m
    })
  });

  return await dispatchWechatAction(fullWechatActions);

}
