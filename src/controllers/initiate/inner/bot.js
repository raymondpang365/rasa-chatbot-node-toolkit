import { userUtterLog, updateUserUtterLogEpicId } from '../../think/Message/utterLog';

import processSimulatedMessage from '../../think/Message/inner/processSimulatedMessage';

import { USER_MESSAGE } from '../../util/extractDetail';

import logger from '../../../utils/logger';

export default async (reverseCommand, stage2_EpicId) => {
  try {
    logger.info(`Bot received reverse command: %o`, reverseCommand);
    const roomId = USER_MESSAGE.roomId(reverseCommand);
    const fromId = USER_MESSAGE.wxid(reverseCommand);
    const text = USER_MESSAGE.content(reverseCommand);

    const utteranceId = await userUtterLog(fromId, roomId, text);
    await updateUserUtterLogEpicId(utteranceId, stage2_EpicId);

    logger.verbose(`Reverse command utterance id found %d`, utteranceId);

    return await processSimulatedMessage(
      {
        payload: reverseCommand,
        utteranceId: utteranceId,
        epicId: stage2_EpicId
      }
    );
  }
  catch(err){
    logger.info(`Error processing reverse command %o:`, err);
  }
}
