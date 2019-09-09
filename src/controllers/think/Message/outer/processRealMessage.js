import { BOT_MESSAGE as extractFromBotMessage } from '../../../util/extractDetail'
import epicManager from '../../Epic/index';
import processMessage from '../processMessage';

import affirmFallbackUtils from '../affirmFallbackUtils'
import vote from '../voteUtils'
import {
  BOT_MESSAGE
} from '../../../../constants/Format'

import { naiveVoteClassification } from '../../../../config';


export default async ({ payload, utteranceId = 0 }) => {

  try {
    if(naiveVoteClassification) {
      const voteChecking = await vote.checking(payload);
      if (voteChecking.isVote) {
        return {
          botMessage: voteChecking,
          stage3_EpicId: null
        }
      }
    }

    const maybeAffirmFallback = payload.message === 'y' || payload.message === 'Y';

    const {
      messageToBeSent ,
      oldUserUtteranceId ,
      botAskAffirmUtteranceId
    }  =  maybeAffirmFallback
      ? await affirmFallbackUtils.checking(payload, utteranceId)
      : {
        messageToBeSent: `0 e ${utteranceId} u| ${payload.message}`,
        oldUserUtteranceId : -1,
        botAskAffirmUtteranceId: -1
      };


    const formData =  {
      sender: payload.sender,
      message: messageToBeSent
    };
    console.log(formData);

    const message = await processMessage(formData);
    console.log(message);

    if(message.data.length === 0) {
      return {
        botMessage: null,
        stage3_EpicId: null
      }
    }
    else {
      const botMessage = message.data[0];
      const stage3_EpicId = await epicManager(botMessage, BOT_MESSAGE);
      botMessage.text = extractFromBotMessage.insertNewEpicId(stage3_EpicId, botMessage);

      console.log('fuck you');
      console.log(botMessage);
      if(maybeAffirmFallback) {

        await affirmFallbackUtils.updateOldConversationEpicId(
          oldUserUtteranceId,
          botAskAffirmUtteranceId,
          );
      }

      console.log(botMessage);
      return {
        botMessage: {
          action: 'reply',
          ...botMessage
        },
        stage3_EpicId};
    }
  }
  catch(err){
    throw err;
  }
}

