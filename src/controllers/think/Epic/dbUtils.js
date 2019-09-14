import {
  q,
  qNonEmpty
} from '../../util/q';


const startNewEpic = async () => {
  return (await qNonEmpty(
    'INSERT INTO epic (id) VALUES (DEFAULT) RETURNING id;', [])
  ).rows[0].id;
};

const findExistingEpic = async (contactId, roomId) => {
  try {
    const previousUtteranceRows = (await q(
      `SELECT u1.epic_id FROM utterance u1 WHERE (u1.created_at, u1.contact_id) IN
      (SELECT MAX(u2.created_at), u2.contact_id FROM utterance u2 
      WHERE u2.contact_id = $1 AND u2.is_bot_to_user=true GROUP BY u2.contact_id)`,
      [contactId])).rows;
    if (previousUtteranceRows.length > 0) {
      return previousUtteranceRows[0].epic_id;
    }
    else {
      return (await qNonEmpty(
        'INSERT INTO epic (id) VALUES (DEFAULT) RETURNING id;', []
      )).rows[0].id;
    }
  }
  catch(err){
    throw err;
  }
};



module.exports = {
  startNewEpic,
  findExistingEpic
}
