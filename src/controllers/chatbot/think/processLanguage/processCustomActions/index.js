import dispatchServiceRequest from './dispatchServiceRequest';
import respondentFound from './respondentFound';
import respondentNotFound from './respondentNotFound';

import rasaProcessor from '../rasaProcessor';
import dispatchWechatAction from '../../dispatchWechatAction';

import qNotEmpty from './handleError';

import { handleError } from './handleError';

const chooseCustomActions = async (params) => {
  try {
    switch (params) {
      case 'action_dispatch_service_request':
      case 'service_request_form':
        return await dispatchServiceRequest(params);
        break;
      case 'action_respondent_found':
        return await respondentFound(params);
        break;
      case 'action_respondent_not_found':
        return await respondentNotFound(params);
        break;
      default:
        break;
    }
  }
  catch(err){
    return handleError({
      scope: 'rasa',
      action: err.action,
      message: err.message
    });
  }

};

const botInitChat = async (reverseCommand) => {
  const botMessages = await rasaProcessor(reverseCommand);
  let fullWechatActions = [];
  botMessages.map(m => {
    fullWechatActions.push({
      action: 'send',
      ...m
    });
  });
  await dispatchWechatAction(fullWechatActions);
};

const processCustomActions = async (req, res) => {

  /**TODO
   *  Extract the token from the text message
   *  Decrypt it with secret code to get the Epic id
   *  Do anything with the Epic id
   */






  const tasks = await chooseCustomActions(req.body);

  let promises = [];

  /**TODO
   *
   * Query the database for the story id
   * where epic_id = this epic id and the contact_id/room_id corresponds to this sender id
   *
   *  Then also store the story_id in the utterance table
   */




  tasks.map(t => promises.push(botInitChat));

  await Promise.all(tasks);

  return tasks.reply;
};


export default processCustomActions;
