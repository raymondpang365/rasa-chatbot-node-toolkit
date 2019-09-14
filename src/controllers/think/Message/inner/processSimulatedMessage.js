import processMessage from '../processMessage'

import logger from '../../../../utils/logger';

export default async ({ payload, utteranceId = 0, epicId = 0 }) => {

  try {

    const formData =  {
      sender: payload.sender,
      message: `${epicId} e ${utteranceId} u| ${payload.message}`
    };
    logger.info(`Request NLP process with message: ${JSON.stringify(formData)}`);

    const message = await processMessage(formData);
    console.log(message);
    logger.info(`Response from NLP process: ${JSON.stringify(formData)}`);

    if(message.data.length === 0) {
      return null;
    }
    else {
      const botMessage = message.data[0];
      console.log(botMessage);

      return botMessage;
    }
  }
  catch(err){
    throw new Error(err);
  }
}
