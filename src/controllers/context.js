import { q, qNonEmpty } from './util/q';
import { CUSTOM_ACTION } from './util/extractDetail';

import logger from '../utils/logger';

import BotWrapper from './cause/outer/BotWapper';

export default {

  async isVote(req, res) {
    // console.log(req);

    const { body } = req;

    const { text } = body;

    const utteranceId = CUSTOM_ACTION.utteranceId(text);

    const contactAndRoom = (await q('SELECT wxid, room FROM utterance WHERE utteranceId = $1', [utteranceId])).rows;

    const room = contactAndRoom[0].room;

    const pollRows = (await q('SELECT p.id, p.question_utterance_id FROM poll p ' +
      'INNER JOIN room r ON p.room_id = r.id ' +
      'WHERE r.code = $1 AND p.completed = false ORDER BY p.id DESC;', [room])).rows;
    if (pollRows.length === 0){
      return false;
    }

    const subject = (await qNonEmpty('SELECT body FROM utterance WHERE id = $1',
      [pollRows[0].question_utterance_id])).rows[0].body;

    logger.info(pollRows[0].question_utterance_id);
    logger.info(subject);

    const { id: pollId } = pollRows[0];

    const optionsRows = (await q('SELECT id, alias, option FROM poll_options ' +
      'WHERE poll_id = $1 ORDER BY alias ASC',
      [pollId])).rows;

    const chosenOption = await CUSTOM_ACTION.slots(payload).option;

    let optionList = '';
    await optionsRows.map(async r => {
      optionList += `${r.alias}) ${r.option} `;
      logger.info(contactId);
      logger.info(r.id);
      if(r.alias ===  chosenOption || r.option === chosenOption){
        await q('INSERT INTO vote (contact_id, poll_option_id) VALUES ($1, $2)',
          [ contactId, r.id ]);
      }
    });

    const optionIdLists = optionsRows.map(r => r.id);

    const optionMap = {};
    optionsRows.map(r => optionMap[r.id.toString()] = r.option);
    logger.info(optionMap);
    let nameList = '';
    let text = '';

    logger.info(JSON.stringify(optionIdLists));

    const voteRows = (await q('SELECT c.wxid as wxid, v.poll_option_id as oid FROM contact c ' +
      'INNER JOIN vote v ON c.id = v.contact_id ' +
      'WHERE v.poll_option_id = ANY($1) ORDER BY v.created_at ASC', [optionIdLists])).rows;
    logger.info(voteRows);
    if (voteRows.length !== 0){
      const names = await Promise.all(voteRows.map(async (r, i) => {
          let contact = await BotWrapper.bot.Contact.load(r.wxid);
          // logger.info(JSON.stringify(contact));
          // logger.info('test');
          return await contact.name(contact);
        })
      )
      names.map((n, i) => {
        let numbering = (i + 1).toString();
        let optionText = optionMap[voteRows[i].oid.toString()];
        //  logger.info(n);

        //  logger.info(optionText);
        // logger.info(nameList);
        if (typeof n === 'string' && typeof optionText === 'string') {
          nameList += "\n" + numbering + "." + n + "选择了" + optionText ;
        }
      });
    }

    if(voteRows.length <= 2){
      for(let i = voteRows.length + 1; i <= 3; i ++){
        nameList += `\n${i}.`;
      }
    }

    text = `${subject} \n ${optionList} \n 接龙：` + nameList
      + '\n\n(清输入讯息"#a","#b"...来进行投票)';

    return {
      action: 'send',
      text: text,
      recipient_id: `#${room}`
    };

  }

};
