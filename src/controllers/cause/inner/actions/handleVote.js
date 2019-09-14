import {
  qNonEmpty,
  q
} from '../../../util/q'
import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../../util/extractDetail'

import BotWrapper from '../../outer/BotWapper'

import logger from '../../../../utils/logger';

export default async (body, epicId) => {
  const roomId = extractFromCustomAction.roomId(body);
  const contactId = await extractFromCustomAction.contactId(body);

  const pollRows = (await q(`SELECT p.id, p.question_utterance_id FROM poll p
    INNER JOIN room r ON p.room_id = r.id 
    WHERE r.code = $1 AND p.completed = false ORDER BY p.id DESC`, [roomId])).rows;

  const subject = (await qNonEmpty('SELECT body FROM utterance WHERE id = $1',
    [pollRows[0].question_utterance_id])).rows[0].body;

  const { id: pollId } = pollRows[0];

  const optionsRows = (await q('SELECT id, alias, option FROM poll_options ' +
    'WHERE poll_id = $1 ORDER BY alias ASC',
    [pollId])).rows;

  const optionChosen = await extractFromCustomAction.content(body).trim();
  console.log(optionChosen);
  console.log(optionsRows);
  let optionList = '';
  await optionsRows.map(async r => {
    optionList += `${r.alias}) ${r.option} `;
    if(r.alias.toUpperCase() ===  optionChosen.toUpperCase() || r.option === optionChosen){
      await q('INSERT INTO vote (contact_id, poll_option_id) VALUES ($1, $2)',
        [ contactId, r.id ]);
    }
  });

  const optionIdLists = optionsRows.map(r => r.id);

  const optionMap = {};
  optionsRows.map(r => optionMap[r.id.toString()] = r.alias);
  let nameList = '';
  let text = '';

  const voteRows = (await q(`SELECT c.wxid as wxid, v.poll_option_id as oid FROM contact c 
    INNER JOIN vote v ON c.id = v.contact_id 
    WHERE v.poll_option_id = ANY($1) ORDER BY v.created_at`, [optionIdLists])).rows;


  if (voteRows.length !== 0){
    const names = await Promise.all(voteRows.map(async (r, i) => {
        let contact = await BotWrapper.bot.Contact.load(r.wxid);

        return await contact.name(contact);
      })
    )
    names.map((n, i) => {
      let numbering = (i + 1).toString();
      let optionText = optionMap[voteRows[i].oid.toString()];

      if (typeof n === 'string' && typeof optionText === 'string') {
        nameList += "\n" + numbering + "." + n + "选择" + optionText ;
      }
    });
  }

  if(voteRows.length <= 2){
    for(let i = voteRows.length + 1; i <= 3; i ++){
      nameList += `\n${i}.`;
    }
  }

  text = `${subject} \n ${optionList} \n 接龙：` + nameList
    + '\n\n(清输入讯息"1","2"...来进行投票)';

  return {
    send: {
      text: text,
      recipient_id: `#${roomId}`
    }
  }
}
