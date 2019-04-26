// import { request } from '../../util';
import axios from 'axios';

async function processMessage(payload) {

  /**
   *  Todo:
   *  If epic ID is not provided as an argument,
   *  insert new epic in db
   *
   *  Encrypt epic iD and concat with message
    */

  try {

    let formData = {
      sender: payload.fromId,
      message: payload.text
    };

    console.log(formData);

    const message = await axios.post(
       'http://localhost:5002/webhooks/rest/webhook',
        formData
      ).then(res => res).catch(err => {throw err});

    console.log(message);

    if(message.data.length > 0) {
      return {
        recipient_id: message.data[0].recipient_id || '',
        text: message.data[0].text || ''
      };
    }
    else {
      throw new Error('no response');
    }
  }
  catch(err){
    throw new Error(err);
  }
}

export default processMessage;
