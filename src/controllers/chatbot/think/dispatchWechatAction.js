const dispatchWechatAction = async (response, senderContactId) => {
  if (!Array.isArray(response) && typeof 'response' !== 'undefined') {
    response = [response];
  }
  let promises = [];

  let promisesResponseMatching = [];

  response.map(async r => {

    const flag = ('flag' in r) ? r.flag : null;
    let toContactId;
    if (r.action === 'reply') toContactId = senderContactId;
    else if (r.action === 'forward' || r.action === 'send') toContactId = r.toContactId;
    promisesResponseMatching.push(r);
    promises.push(
      p.query('INSERT INTO utterance (body, contact_id, room_id, bot, flag, created_at) VALUES ' +
        '($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id',
        [r.message, toContactId, roomId, true, flag])
    );

  });
  let insertResults = await Promise.all(promises)
    .then(res => res).catch(err => {
      throw err
    });

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
    .then(res => res).catch(err => {
      throw err
    });

  return response;
};

export default dispatchWechatAction;
