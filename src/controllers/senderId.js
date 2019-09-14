import { q, qNonEmpty } from './util/q';
import { NLU_MESSAGE } from './util/extractDetail';

import asyncRoute from '../utils/asyncRoute'

import logger from '../utils/logger';

export default asyncRoute(
  async (req,res) => {

    const { body } = req;

    logger.info('Get request on route /api/chatbot/sender_id %o', body);

    const { senderId } = await NLU_MESSAGE.sender(body);

    logger.info('Sender id: %d', senderId);

    if(typeof senderId !== 'string'){
      return res.json({
        recipient_id: null,
        action: null
      });
    }
    try {
      const rows = (await q("SELECT action_name FROM events WHERE sender_id = $1 " +
        "AND type_name = 'action' " +
        "AND action_name <> 'action_listen' ORDER BY id DESC LIMIT 1;",
        [senderId])).rows;
      if (rows.length > 0) {
        return res.json({
          recipient_id: senderId,
          action: rows[0].action_name
        });
      }
      else{
        console.log('No rows found');
        return res.json({
          recipient_id: senderId,
          action: null
        });
      }
    }
    catch(err){
      console.log(err);
      return res.error({
        message: err.toString()
      });
    }



});
