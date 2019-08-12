
const cron = require('node-cron');
import { q, qNonEmpty } from '../util/q';
import composeContent from './composeContent';

import BotWrapper from '../cause/outer/BotWapper'

const announcer = cron.schedule('*/1 * * * *', async () => {
  try {


    const rows = (await q('SELECT id, room_id, is_to_all_members, scenario_id FROM schedule\n' +
      'WHERE ((EXTRACT (EPOCH FROM (CURRENT_TIMESTAMP - last_announced)) > 120 OR last_announced ISNULL)\n' +
      '      AND is_repeated = TRUE\n' +
      '      AND MOD((EXTRACT (EPOCH FROM (first_time - CURRENT_TIMESTAMP))::INTEGER), time_interval) BETWEEN -60 AND 60)\n' +
      '           OR EXTRACT(EPOCH FROM ( first_time - CURRENT_TIMESTAMP )) BETWEEN -60 AND 60;'
    )).rows;

    console.log(rows);

    if (rows.length > 0) {

      if(BotWrapper.bot === null || BotWrapper.loggedIn === false){
        return;
      }

      const outerPromises = rows.map(async r => {
          const asyncFunc = async () => {
            const {id, scenario_id, is_to_all_members, room_id} = r;
            const unfilledContent =  (await qNonEmpty('SELECT default_template FROM scenario WHERE id = $1',
              [scenario_id])).rows[0].default_template;

            const content = await composeContent(unfilledContent, room_id);

            console.log(room_id);
            const room = await BotWrapper.bot.Room.load(room_id);
            console.log(room);
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
          };
          return await asyncFunc();
      });

      await Promise.all(outerPromises).then(res => res).catch(err => {
        throw err
      });
    }
  }
  catch(err){
    console.log(err);
  }

});

announcer.start();


