import p from '../../../utils/agents';

const yes_no = async (decision, text, senderContactId, fromId, previousUtteranceId) => {

  console.log('yes_no file');

  let res1 = await p.query('SELECT * FROM match WHERE respondent_utterance_id = $1', [previousUtteranceId])
    .then(res => res).catch(err => console.log(err));

  if (res1.rows.length === 0){
    return {
      action: 'fallback'
    }
  }

//  console.log(res1.rows[0]);

  let tagId = res1.rows[0].tag_id;
  let enquirerRoomId = res1.rows[0].enquirer_room_id;
  let enquirerContactId = res1.rows[0].enquirer_id;

  let res2 = await p.query('SELECT tag_name FROM tag WHERE id = $1', [tagId])
    .then(res => res).catch(err => console.log(err));

  let category = res2.rows[0].tag_name;
  if (text === 'A' || text === 'a') {

    await p.query('UPDATE match SET respondent_id = $1 WHERE id = $2',
      [senderContactId, res2.rows[0].id]
    ).then(res => res).catch(err => console.log(err));

    let res3 = await p.query('SELECT wxid FROM contact WHERE id = $1', [enquirerContactId])
      .then(res => res).catch(err => console.log(err));

    let enquirerWxid = res3.rows[0].wxid;

    return [
        {
          action: 'send',
          message: `${category}员工已接受你的请求。`,
          to: enquirerWxid,
          room: enquirerRoomId || undefined,
          toContactId: enquirerContactId
        },
        {
          action: 'reply',
          message: '谢谢 ：）',
        },
        {

        }
    ];
  }
  else if (text === 'B' || text === 'b') {
    return {
      action: 'reply',
      message: `无问题`,
    }
  }
  else {
    return {
      action: 'fallback'
    }
  }
};

export default yes_no;

