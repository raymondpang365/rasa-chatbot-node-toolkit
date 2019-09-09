import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../../util/extractDetail';

import {
  UTTER_ASK_POLL_OPTIONS,
  UTTER_START_POLL_RESPONSE
} from '../../../../constants/BotActions'

import {
   q, qNonEmpty,
} from '../../../util/q';

export const logPollSubject = async (body, epicId) => {
  try {
    const questionUtteranceId = extractFromCustomAction.utteranceId(body);
    const wxid = extractFromCustomAction.wxid(body);
    let roomCode = extractFromCustomAction.roomId(body);

    if(roomCode === null){
      const roomSqlRows = (await q('SELECT cr.room_id FROM contact_room INNER JOIN contact ' +
        'ON c.id = cr.contact_id WHERE c.wxid = $1',[wxid])).rows;

      roomCode = roomSqlRows.rows[0].room_id;
    }

    const roomId = (await(qNonEmpty('SELECT id FROM room WHERE code = $1', [roomCode]))).rows[0].id;

    await qNonEmpty('INSERT INTO poll (question_utterance_id, epic_id, room_id, completed) VALUES ($1, $2, $3, false) RETURNING id',
      [questionUtteranceId, epicId, roomId]);

    return {
      reply: {
        action: UTTER_ASK_POLL_OPTIONS,
      },
      reverseCommands: []
    };

  }
  catch(err){
    console.log(err)
  }
};

//const listing = (i) => `#${String.fromCharCode(i+97)}`;
const listing = i => `${i+1}`;

export const startPoll = async (body, epicId) => {
  try {
    const optionsText = extractFromCustomAction.content(body);


    const options = optionsText.split(',').map(o => o.trim());

    const { room_id, question_utterance_id: questionUtteranceId, id: pollId } = (
      await qNonEmpty(
      "SELECT room_id, question_utterance_id, id FROM poll WHERE epic_id = $1 ORDER BY id DESC",
      [epicId])
    ).rows[0];

    const code = (await qNonEmpty("SELECT code FROM room WHERE id = $1;", [room_id])).rows[0].code;
    const { body: subject } = (await qNonEmpty("SELECT body FROM utterance WHERE id = $1", [questionUtteranceId])).rows[0];
    options.map(async (o, i) => {
      await qNonEmpty("INSERT INTO poll_options (poll_id, option, alias) VALUES ($1, $2, $3) RETURNING id;",
        [pollId, o, listing(i) ]);
    });

   let optionList = '';
   options.map((o, i) => {
     optionList += `${listing(i)}) ${o.trim()} `
   });

   const text = `${subject}\n${optionList}\n接龙：\n1. \n 2. \n 3. \n\n`+
   '(清输入讯息"1","2"...来进行投票)';

    return {
      reply: {
        action: UTTER_START_POLL_RESPONSE,
      },
      send: [{
        text,
        recipient_id: code
      }],
      reverseCommands: []
    };
  }
  catch(err){
    console.log(err)
  }
};
