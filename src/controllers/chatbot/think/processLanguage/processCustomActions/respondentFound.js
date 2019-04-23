import p from '../../../../../../utils/agents';

const respondentFound = async (decision, text, senderContactId, fromId, previousUtteranceId) => {

  let res1 = await p.query('SELECT * FROM match WHERE respondent_utterance_id = $1', [previousUtteranceId])
    .then(res => res).catch(err => console.log(err));

  if (res1.rows.length === 0){
    return {
      reply: {
        action: 'fallback'
      }
    }
  }

  let tagId = res1.rows[0].tag_id;
  let enquirerRoomId = res1.rows[0].enquirer_room_id;
  let enquirerContactId = res1.rows[0].enquirer_id;

  let res2 = await p.query('SELECT tag_name FROM tag WHERE id = $1', [tagId])
    .then(res => res).catch(err => console.log(err));

  await p.query('UPDATE match SET respondent_id = $1 WHERE id = $2',
    [senderContactId, res2.rows[0].id]
  ).then(res => res).catch(err => console.log(err));

  let res3 = await p.query('SELECT wxid FROM contact WHERE id = $1', [enquirerContactId])
    .then(res => res).catch(err => console.log(err));

  let enquirerWxid = res3.rows[0].wxid;

  return {
    reply: {
      action: 'action_thanks'
    },
    reverseCommand: [
      {
        message: '/服务要求被接受 service:[清洁](service) staffName:[刘明](name)',
        to: enquirerWxid,
        room: enquirerRoomId || undefined,
        toContactId: enquirerContactId
      }
    ]
  }
};

export default respondentFound;

