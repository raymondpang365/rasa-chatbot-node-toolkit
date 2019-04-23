import p from '../../../../../../utils/agents';

export default async (params) => {

  let category = '';
  let wxid = '';
  let replyMessage = '';
  category = params.slots.service;

  console.log(category);

  let res0 = await p.query('SELECT id from tag WHERE tag_name = $1',
    [category])
    .then(res => res).catch(err => console.log(err));

  console.log('fuck0');
  console.log(res0.rows);
  console.log(res0.rows[0]);
  console.log('fuckend0');

  let matchIdResult = await p.query('INSERT INTO match (enquirer_id, enquirer_room_id, utterance_id, tag_id) VALUES ($1, $2, $3, $4) RETURNING id;',
    [senderContactId, senderRoomId, utteranceId, res0.rows[0].id])
    .then(res => res).catch(err => console.log(err));

  let res1 = await p.query(
        'SELECT ct.contact_id FROM tag t ' +
        'INNER JOIN contact_tag ct ON ct.tag_id = t.id ' +
        'WHERE t.tag_name = $1', [category])
    .then(res => res).catch(err => console.log(err));

  let rows1 = res1.rows;
  if (rows1.length <= 0) return {
    reply: {
      action: 'action_respondent_not_found'
    }
  };


  let found1 = rows1[0];

  let res2 = await p.query(
    'SELECT wxid FROM contact c WHERE id = $1', [found1.contact_id])
    .then(res => res).catch(err => console.log(err));

  let rows2 = res2.rows;

  if(rows2.length <= 0) return {
    reply: {
      action: 'action_respondent_not_found'
    }
  };


  let found2 = rows2[0];
  if(typeof found2.wxid === 'string' && found2.wxid.length > 0){
    wxid = found2.wxid;
  }

  console.log(wxid);
  console.log(category);

  if(wxid === '' || category === '') {
    return {
      reply: {
        action: 'action_respondent_not_found'
      }
    }
  }
  else {
    return {
      reply: {
        action: 'action_service_request_response'
      },
      reverseCommand: [{
        command: '/委派工作 service:[清洁](service) floor:[18](floor) flat:[A](flat)',
        matchId: matchIdResult.rows[0].id,
        to: wxid,
        toContactId: found1.contact_id
      }]
    };
  }

}
