import {
  q,
  qNonEmpty,
} from '../util/q';

import {
  BOT_MESSAGE as extractFromBotMessage
} from '../util/extractDetail'

module.exports = {
  userUtterLog: async (fromId, roomId, text)=>{
    const senderContactIdResult = await q('SELECT id FROM contact WHERE wxid = $1;',
      [fromId])

    const senderContactId = (senderContactIdResult.rows.length <= 0)
      ? (await qNonEmpty(
        'INSERT INTO contact (wxid) VALUES ($1) RETURNING id;',
        [fromId])).rows[0].id
      : null;

    return (await qNonEmpty(
      'INSERT INTO utterance (body, contact_id, room_id, is_bot_to_user, created_at) VALUES ' +
      '($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id;',
      [text,  senderContactId , roomId, false])).rows[0].id;
  },

  botUtterLog: async (wechatActions, epicId) => {
    if (typeof wechatActions !== 'undefined' && !Array.isArray(wechatActions))
      wechatActions = [wechatActions];

    await Promise.all(
      wechatActions.map(async a => {

        console.log(a);

        const wxid = await extractFromBotMessage.wxid(a);
        const contactId = parseInt(await extractFromBotMessage.contactId(a));
        const roomId =  extractFromBotMessage.roomId(a);

        console.log(epicId);
        console.log(contactId);
        console.log(roomId);

        const storyRows = (a.action === 'send')
          ? (await qNonEmpty(
            'INSERT INTO story (epic_id, contact_id, room_id) VALUES ($1, $2, $3) RETURNING id',
            [epicId, contactId, roomId]
          )).rows
          : (await q(
            'SELECT id FROM story WHERE epic_id = $1 AND contact_id = $2',
            [epicId, contactId]
          )).rows;

        const storyId = (storyRows.length > 0) ? storyRows[0].id : null;

        console.log(a.text);
        console.log(storyId);
        console.log(wxid);

        return (await qNonEmpty('INSERT INTO utterance (contact_id, body, room_id, story_id, is_bot_to_user, created_at) ' +
          'SELECT c.id, $1, $2, $3, $4, CURRENT_TIMESTAMP FROM contact c WHERE wxid = $5 RETURNING id;',
          [a.text, null, storyId, true, wxid])).rows[0].id
      })
    );
  }
}
