import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../../util/extractDetail';

import {
  UTTER_ROOM_ASK_AFFIRM_SERVICE_REQUEST,
  UTTER_ASK_AFFIRM_SERVICE_REQUEST
} from '../../../../constants/BotActions'

import {
  qNonEmpty,
} from '../../../util/q';

import logger from '../../../../utils/logger';

export default async (body, epicId) => {
  try {
    const utteranceId = extractFromCustomAction.utteranceId(body);
    const extraParams = extractFromCustomAction.extraParams(body);

    console.log(extraParams);

    if (extraParams === null) {
      throw new Error('No extra params provided');
    }

    const {intent_to_be_affirmed: intentToBeAffirmed, is_room: isRoom} = extraParams;


    await qNonEmpty(`INSERT INTO affirmation (utterance_id, intent_name, affirmed) VALUES 
        ($1, $2, FALSE) RETURNING id;`,
      [utteranceId, intentToBeAffirmed]);

    let action = '';

    logger.info(`Intent to be affirmed: ${JSON.stringify(intentToBeAffirmed)}`);

    switch (intentToBeAffirmed) {
      case 'lol':
        action = isRoom
          ? UTTER_ROOM_ASK_AFFIRM_SERVICE_REQUEST
          : UTTER_ASK_AFFIRM_SERVICE_REQUEST;
        break;
      default:
        action = isRoom
          ? UTTER_ROOM_ASK_AFFIRM_SERVICE_REQUEST
          : UTTER_ASK_AFFIRM_SERVICE_REQUEST;
        break;
    }

    return {
      reply: {
        action: action,
      },
      reverseCommands: []
    };
  }
  catch(err){
    logger.error(err)
  }
}
