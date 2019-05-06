import processMessage from './processMessage';
import {
  userUtterLog,
  botUtterLog
} from './utterLog';

import getExtraAction from './getExtraAction';

import { BOT_MESSAGE as extractFromBotMessage } from '../util/extractDetail'

export default async (payload) => {

  try {

    let {fromId, roomId, text} = payload;

    const utteranceId = await userUtterLog(fromId, roomId, text);

    const formData = {
      sender: typeof roomId === 'string' && roomId.length > 0 ? `${fromId}@${roomId}`: fromId,
      message: text
    };

    const botMessage = await processMessage({
      payload: formData,
      utteranceId
    });

    const epicId = extractFromBotMessage.epicId(botMessage);

    await botUtterLog(
      { action: 'reply', ...botMessage },
      epicId
    );

    const wechatAction = {
      action: 'reply',
      text: extractFromBotMessage.content(botMessage),
      to: extractFromBotMessage.wxid(botMessage),
      room: extractFromBotMessage.roomId(botMessage)
    }
    console.log(botMessage)
    const extraWechatAction = await getExtraAction(botMessage);
    console.log(extraWechatAction);
    return [wechatAction, ...extraWechatAction];
  }
  catch(err){
    throw err;
  }

}

