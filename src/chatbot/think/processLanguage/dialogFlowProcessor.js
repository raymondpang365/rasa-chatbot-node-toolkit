const dialogFlow = require('dialogflow');
const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */

const sessionId = uuid.v4();
const projectId = 'faq-cnnkcn';
const sessionClient = new dialogFlow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

async function processMessage(payload) {

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: payload.text,
        languageCode: 'zh-CN',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
   // console.log(responses);
    const result = responses[0].queryResult;
    return result;
  }
  catch(err){
    throw new Error(err);
  }
}

export default processMessage;
