import { userUtterLog, botUtterLog } from '../../think/Message/utterLog';

import processRealMessage from '../../think/Message/outer/processRealMessage';

import {
  BOT_MESSAGE as extractFromBotMessage
} from '../../util/extractDetail'


import getExtraAction from '../../initiate/util/getExtraAction';

export default async (payload) => {

  try {

    let {fromId, roomId, text} = payload;

    const utteranceId = await userUtterLog(fromId, roomId, text);

    const formData = {
      sender: typeof roomId === 'string' && roomId.length > 0 ? `${fromId}#${roomId}` : fromId,
      message: text
    };

    const { botMessage, stage3_StoryId } = await processRealMessage({
      payload: formData,
      utteranceId: utteranceId,
      epicId: 0,
    });
    if (botMessage === null) return [];

    await botUtterLog(
      botMessage,
      stage3_StoryId
    );

    const wechatAction = {
      action: botMessage.action,
      text: extractFromBotMessage.content(botMessage),
      to: extractFromBotMessage.wxid(botMessage),
      room: extractFromBotMessage.roomId(botMessage)
    };

    const extraWechatAction = await getExtraAction(botMessage);
    return [wechatAction, ...extraWechatAction];

  }
  catch(err){
    throw err;
  }

}

