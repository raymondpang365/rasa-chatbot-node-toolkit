import { BOT_MESSAGE } from '../../util/extractDetail'
import { ACTION_RESPONDENT_FOUND } from '../../../constants/BotActions'

import { q, qNonEmpty } from '../../util/q'

import logger from '../../../utils/logger';

export default async botMessage => {
  const action = await BOT_MESSAGE.action(botMessage);
  logger.info(`Bot received action: ${action}`);
  const epicId = BOT_MESSAGE.epicId(botMessage);
  logger.info(`Epic ID of action is retrieved : %o`, action);

  if(action === ACTION_RESPONDENT_FOUND) {
    const respondentWxid = (await qNonEmpty(
      'SELECT c.wxid FROM contact c INNER JOIN match m ON c.id = m.respondent_id WHERE m.epic_id = $1',
      [epicId]
    )).rows[0].wxid;

    const enquirerWxid = (await qNonEmpty(
      'SELECT c.wxid FROM contact c INNER JOIN match m ON c.id = m.enquirer_id WHERE m.epic_id = $1',
      [epicId]
    )).rows[0].wxid;

    return [{
      action: 'send',
      contact_card: respondentWxid,
      to: enquirerWxid,
      room: null
    }]
  }
  else{
    return [];
  }

}
