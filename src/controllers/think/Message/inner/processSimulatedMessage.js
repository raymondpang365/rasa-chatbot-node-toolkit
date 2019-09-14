import processMessage from '../processMessage'

import logger from '../../../../utils/logger';

export default async ({ payload, utteranceId = 0, epicId = 0 }) => {

  try {

    const formData =  {
      sender: payload.sender,
      message: `${epicId} e ${utteranceId} u| ${payload.message}`
    };
    logger.info('Request NLP process with message: %o', formData);

    const message = await processMessage(formData);

    logger.info('Response from NLP process: %o', message.data );

    if(message.data.length === 0) {
      return null;
    }
    else {
      const botMessage = message.data[0];

      return botMessage;
    }
  }
  catch(err){
    throw new Error(err);
  }
}
