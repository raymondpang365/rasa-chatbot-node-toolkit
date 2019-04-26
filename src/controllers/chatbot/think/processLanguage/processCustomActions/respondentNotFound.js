import { UTTER_ALRIGHT } from '../../../../../constants/BotActions'

const respondentNotFound = async () => {

  return {
    reply: {
      action: UTTER_ALRIGHT
    }
  }


};

export default respondentNotFound;

