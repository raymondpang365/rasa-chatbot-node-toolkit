import processLanguage from './processLanguage/dialogFlowProcessor';
import makeAction from './makeAction'
import p from '../../utils/agents';



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

  let insertResult = await p.query(
    'INSERT INTO utterance (body, contact_id, room_id, bot, created_at) VALUES ' +
    '($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id;',
    [text,  senderContactId , roomId, false])
    .then(res => res)
    .catch(err => console.log(err));

  let lastInsertedId = insertResult.rows[0].id;

  let decision = await processLanguage(payload);

  let response = await makeAction(decision, payload, senderContactId, lastInsertedId);
  console.log('think/index.js');
  console.log(response);



 // const toContactId = response.action === 'reply'? senderContactId :


  if(Array.isArray(response)){
    let promises = [];

    let promisesResponseMatching = []

    response.map(async r => {

      const flag = ('flag' in r)? r.flag : null;
      let toContactId;
      if( r.action === 'reply' ) toContactId = senderContactId;
      else if( r.action === 'forward' || r.action === 'send') toContactId = r.toContactId;
      promisesResponseMatching.push(r);
      promises.push(
        p.query('INSERT INTO utterance (body, contact_id, room_id, bot, flag, created_at) VALUES ' +
        '($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id',
        [r.message, toContactId, roomId, true, flag])
      );

    });
    let insertResults = await Promise.all(promises)
      .then(res => res).catch(err => {throw err});

    promises = [];

    console.log(insertResults);

    insertResults.map((ir, index) => {

      console.log(ir.rows);
      console.log(promisesResponseMatching[index]);

      if ('scenario' in promisesResponseMatching[index] &&
        promisesResponseMatching[index].scenario === 'dispatch') {
        promises.push(p.query('UPDATE match SET respondent_utterance_id = $1 WHERE id = $2',
          [ir.rows[0].id, promisesResponseMatching[index].matchId]));
      }
    });

    await Promise.all(promises)
      .then(res => res).catch(err => {throw err});



  }
  else{

    const flag = ('flag' in response)? response.flag : null;

    let toContactId;
    if( response.action === 'reply' ) toContactId = senderContactId;
    else if( response.action === 'forward' || response.action === 'send') toContactId = response.toContactId;
    let idResult = await p.query('INSERT INTO utterance (body, contact_id, room_id, bot, flag, created_at) VALUES ' +
      '($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id',
      [response.message, toContactId, roomId, true, flag])
      .then(res => res).catch(err => {throw err});
    console.log('fuckyoustart');
    console.log(response);
    console.log(response.scenario)
    console.log('fuckyouend');
    if('scenario' in response && response.scenario === 'dispatch'){
      await p.query('UPDATE match SET respondent_utterance_id = $1 WHERE id = $2',
        [idResult.rows[0].id, response.matchId])
        .then(res => res).catch(err => {throw err});
    }
  }

  return response;

}
