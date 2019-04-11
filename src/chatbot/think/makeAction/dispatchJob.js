import p from '../../../utils/agents';

export default async (result, senderContactId, senderRoomId, utteranceId) => {

  let category = '';
  let wxid = '';

  if (result.parameters) {
    if (result.parameters &&
        result.parameters.fields &&
        result.parameters.fields.object &&
        result.parameters.fields.object.stringValue
    ) {
      category = result.parameters.fields.object.stringValue;
    }
  }

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
    action: 'reply',
    message: `抱歉， 没有${category}员工，我会帮你向管理处联络。`
  };
  let found1 = rows1[0];

  let res2 = await p.query(
    'SELECT wxid FROM contact c WHERE id = $1', [found1.contact_id])
    .then(res => res).catch(err => console.log(err));

  let rows2 = res2.rows;

  if(rows2.length <= 0) return {
    action: 'reply',
    message: `抱歉， 没有${category}员工，我会帮你向管理处联络。`
  };

  let found2 = rows2[0];
  if(typeof found2.wxid === 'string' && found2.wxid.length > 0){
    wxid = found2.wxid;
  }

  console.log(wxid);
  console.log(category);

  if(wxid === '' || category === ''){
    return{
      action: 'reply',
      message: result.fulfillmentText
    }
  }
  const response = [
    {
      action: 'send',
      message: `有人现要${category}员工帮忙。请选择： A）接受 B）拒绝`,
      flag: 'yes_no',
      scenario: 'dispatch',
      matchId: matchIdResult.rows[0].id,
      to: wxid,
      toContactId: found1.contact_id
    },
    {
      action: 'reply',
      message: `好，我马上问问在班的${category}员工有没有空帮忙。`,
    }
  ];
  console.log(response);
  return response;

}
