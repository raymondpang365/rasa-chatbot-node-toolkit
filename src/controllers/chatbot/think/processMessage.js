import axios from 'axios';
import { BOT_MESSAGE as extractFromBotMessage } from '../util/extractDetail'
import epicManager from './EpicManagament/manager/index';
import {
  BOT_MESSAGE
} from '../../../constants/Format'

async function processMessage({ payload, utteranceId = 0, epicId = 0 }) {

  try {
    const formData =  {
      sender: payload.sender,
      message: `${epicId} e ${utteranceId} u| ${payload.message}`
    };
    console.log(formData);

    const message = await axios.post(
       'http://localhost:5002/webhooks/rest/webhook',
        formData
      ).then(res => res).catch(err => {throw err});


    if(message.data.length === 0) {
      throw new Error('no response');
    }
    else {
      const botMessage = message.data[0];
      const epicId = await epicManager(botMessage, BOT_MESSAGE);
      botMessage.text = extractFromBotMessage.insertNewEpicId(epicId, botMessage);

      console.log(botMessage);
      return botMessage;
    }
  }
  catch(err){
    throw new Error(err);
  }
}

export default processMessage;
