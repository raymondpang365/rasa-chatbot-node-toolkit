import { userUtterLog, updateUserUtterLogEpicId } from '../../think/Message/utterLog';

import processSimulatedMessage from '../../think/Message/inner/processSimulatedMessage';

import { USER_MESSAGE } from '../../util/extractDetail';



export default async (reverseCommand, stage2_EpicId) => {
  try {
    console.log(reverseCommand);
    const roomId = USER_MESSAGE.roomId(reverseCommand);
    console.log('haha1')
    const fromId = USER_MESSAGE.wxid(reverseCommand);
    console.log('haha2')
    const text = USER_MESSAGE.content(reverseCommand);
    console.log('haha3')
    console.log(fromId);
    console.log(roomId);
    console.log(text);
    const utteranceId = await userUtterLog(fromId, roomId, text);
    await updateUserUtterLogEpicId(utteranceId, stage2_EpicId);

    console.log(utteranceId);
    return await processSimulatedMessage(
      {
        payload: reverseCommand,
        utteranceId: utteranceId,
        epicId: stage2_EpicId
      }
    );
  }
  catch(err){
    console.log(err);
  }
}
