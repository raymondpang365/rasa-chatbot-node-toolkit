import p from '../../../utils/agents';


const dispatchWechatAction = async (wechatActions, actionType) => {
  if (typeof wechatActions !== 'undefined' && !Array.isArray(wechatActions)) {
    wechatActions = [wechatActions];
  }

  /** TODO
   *  add new story to db if it is a send but not a reply action
   */

  /** TODO
   *  while storing any utterance, also store story id
   */

  let promises = [];

  wechatActions.map(async a => {

    promises.push(
      p.query('INSERT INTO utterance (body, room_id, contact_id, created_at) ' +
        'SELECT $1, $2, c.id, CURRENT_TIMESTAMP FROM contact c WHERE wxid = $3 RETURNING id;',
        [atext, null, a.recipient_id])
    );
  });
  await Promise.all(promises)
    .then(res => res).catch(err => {
      throw err
    });

  return wechatActions;
};

export default dispatchWechatAction;
