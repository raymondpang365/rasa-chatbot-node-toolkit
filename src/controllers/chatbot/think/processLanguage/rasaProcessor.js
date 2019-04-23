const dialogFlow = require('dialogflow');
const uuid = require('uuid');

import { request } from '../../../util';

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */


async function processMessage(payload) {

  try {
    const formdata ={
      "sender": payload.fromId,
      "message": payload.text
    } ;

    const message = await request.post({
        url: 'http://localhost:5002/webhooks/rest/webhook',
        form: formdata
      });

    return {
      to: payload.fromId,
      message: message
    };
  }
  catch(err){
    throw new Error(err);
  }
}

export default processMessage;
