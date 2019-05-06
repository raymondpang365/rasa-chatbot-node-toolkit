import {
  q,
  qNonEmpty
} from '../../../util/q';

const startNewEpic = async (contactId, roomId) => {
  const epicId = await qNonEmpty(
    'INSERT INTO epic (id) VALUES (DEFAULT) RETURNING id;', []
  ).rows[0].id;
  const storyId = (await qNonEmpty(
      'INSERT INTO story (epic_id, contact_id, room_id) VALUES ($1, $2, $3) RETURNING id',
      [epicId, contactId, roomId])
  ).rows[0].id;

  return {epicId, storyId};
};

const findExistingEpic = async (contactId, roomId) => {
  const previousUtteranceRows = await q(
    'SELECT u1.* FROM utterance u1 WHERE (u1.created_at, u1.contact_id) IN ' +
    '(SELECT MAX(u2.created_at), u2.contact_id FROM utterance u2 ' +
    'WHERE u2.contact_id = $1 AND u2.is_bot_to_user=true GROUP BY u2.contact_id)',
    [contactId]);
  if (previousUtteranceRows.rows.length > 0) {
    const previousUtteranceStoryId = previousUtteranceRows.rows[0].story_id;
    const epicId = (await qNonEmpty(
      'SELECT epic_id FROM story WHERE id = $1',
      [previousUtteranceStoryId])).rows[0].epic_id;
    return { epicId, previousUtteranceStoryId }
  }
  else {
    const epicId = (await qNonEmpty(
      'INSERT INTO epic (id) VALUES (DEFAULT) RETURNING id;', []
    )).rows[0].id;
    const storyId = (await qNonEmpty(
      'INSERT INTO story (epic_id, contact_id, room_id) VALUES ($1, $2, $3) RETURNING id',
      [epicId, contactId, roomId])).rows[0].id;
    return { epicId, storyId }
  }
};

const dbUpdateStoryId = async (utteranceId, storyId) => {
  if(utteranceId !== 0)
    return await qNonEmpty(
      'UPDATE utterance u SET story_id = $1 WHERE id = $2 RETURNING id;',
      [storyId, utteranceId]
    );
};

module.exports = {
  startNewEpic,
  findExistingEpic,
  dbUpdateStoryId
}
