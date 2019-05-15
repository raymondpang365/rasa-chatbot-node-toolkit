
const cron = require('node-cron');
import { q } from './util/q';

import  { Room, Contact} from 'Wechaty'

cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('running a task every minutes');


    const rows = (await q('SELECT id, room_id, is_to_all_members, content FROM schedule WHERE ' +
      'EXTRACT(' +
      'EPOCH FROM (' +
      'CURRENT_TIMESTAMP - last_announced' +
      ') > 300 ' +
      'AND (' +
      '(is_repeated = TRUE AND ' +
      'MOD(' +
      'EXTRACT(' +
      'EPOCH FROM (' +
      'first_time - CURRENT_TIMESTAMP' +
      ')' +
      '), ' +
      'time_interval' +
      ') BETWEEN -60 AND 60' +
      ') ' +
      'OR ' +
      'EPOCH FROM ( ' +
      'first_time - CURRENT_TIMESTAMP ' +
      ') BETWEEN -60 AND 60 ' +
      ')'
    )).rows;

    if (rows.length > 0) {
      let outerPromises = rows.map(async r =>
        await(async () => {
          const {id, content, is_to_all_members, room_id} = r;
          const room = await Room.find(room_id);

          const promises = [];
          if (is_to_all_members) {
            const roomMembers = await room.memberAll();
            roomMembers.map(async rm => {
              promises.push(await rm.say(content));
            })
          }
          else {
            promises.push(await room.say(content));
          }

          await Promise.all(promises).then(res => res).catch(err => {
            throw err
          });
          await q('UPDATE schedule SET last_announced = CURRENT_TIMESTAMP WHERE id = $1', [id]);
        })
      );
      await Promise.all(outerPromises).then(res => res).catch(err => {
        throw err
      });
    }
  }
  catch(err){
    console.log(err);
  }

});
