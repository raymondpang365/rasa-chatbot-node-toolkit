import dispatchServiceRequest from '../dispatchServiceRequest';
import respondentFound from '../respondentFound';
import respondentNotFound from '../respondentNotFound';

import processMessage from '../../processMessage';
import { botUtterLog, userUtterLog } from '../../utterLog';
import epicManager from '../../EpicManagament/manager/index';

import asyncRoute from '../../../../../utils/asyncRoute'
import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../../util/extractDetail';
import {
  handleCustomActionError,
} from '../../../util/q';

import { activeTalk } from '../../../communicate';
import {  customActions } from '../../../../../constants/BotActions'

import { CUSTOM_ACTION } from '../../../../../constants/Format'

const chooseCustomActions = async (body, action) => {

  try {
    const epicId = await epicManager(body, CUSTOM_ACTION);
    let tasks = {
        reply: {
          action: ''
        },
        reverseCommands: []
      };

    switch (action) {
      case 'action_dispatch_service_request':
      case 'service_request_form':
        tasks = await dispatchServiceRequest(body, epicId);
        break;
      case 'action_respondent_found':
        tasks = await respondentFound(body, epicId);
        break;
      case 'action_respondent_not_found':
        tasks = await respondentNotFound(body);
        break;
      default:
        break;
    }
    return { tasks, epicId: epicId }
  }
  catch(err){
    console.log('error');
    const tasks =  handleCustomActionError({
      action: err.action,
      message: err
    });
    return { tasks, epicId: 0 }
  }
};

/* This is a closure. Ignore the unused parameters warning */

const botInitChat = async (reverseCommand, epicId) => {
  try {

    const utteranceId = await userUtterLog(reverseCommand);

    let botMessages = await processMessage(
      {payload: reverseCommand, epicId, utteranceId}
    );
    if(!Array.isArray(botMessages))
      botMessages = [botMessages];

    const fullWechatActions = botMessages.map(m => {
      return {action: 'send', ...m}
    });
    await botUtterLog(fullWechatActions, epicId);
    activeTalk(botMessages);
    return true;
  }
  catch (err) {
    throw err;
  }
};

const validate = async req => {
  const { body } = req;
  const action = await extractFromCustomAction.action(body);
  if (!customActions.includes(action)) {
    throw new Error(`Invalid action ${action}`);
  }
};

export default asyncRoute(
  async (req,res) => {
    try {
      await validate(req);

      const { body } = req;
      const action = await extractFromCustomAction.action(body);

      const { tasks, epicId }  = await chooseCustomActions(body, action);
      console.log(tasks);

      if('reply' in tasks){
        res.json({ ...tasks.reply, epic_id: epicId });
      }
      else{
        res.json({
          action: '',
          epic_id: epicId
        });
      }

      if(Array.isArray(tasks.reverseCommands)
        && tasks.reverseCommands.length > 0)
        await Promise.all(
          tasks.reverseCommands.map(async rc =>
            await botInitChat(rc, epicId)
          )
        ).then(res => res).catch(err => { throw err; })
    }
    catch(err){
      if(!res.headersSent){
        res.status(500).json({
          message: err.toString()
        });
      }
      console.log(err.toString);
    }
  }
);

