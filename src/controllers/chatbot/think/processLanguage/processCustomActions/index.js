import dispatchServiceRequest from './dispatchServiceRequest';
import respondentFound from './respondentFound';
import respondentNotFound from './respondentNotFound';

import rasaProcessor from '../rasaProcessor'
import dispatchWechatAction from '../../../dispatchWechatAction';

const chooseCustomActions = async (params) => {
  switch (params){
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
};

const botInitChat = async (reverseCommand) => {
  const messages = await rasaProcessor(reverseCommand);
  await dispatchWechatAction(
    {
      action: 'send',
      toContactId: payload.toContactId,
      ...messages,
    });
};

const processCustomActions = async (req, res) => {
  const tasks = await chooseCustomActions(req.body.action);

  let promises = [];

  tasks.map(t => promises.push(botInitChat));

  await Promise.all(tasks);

  return tasks.reply;
};


export default processCustomActions;
