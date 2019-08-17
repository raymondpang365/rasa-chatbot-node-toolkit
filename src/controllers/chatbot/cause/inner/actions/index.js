import dispatchServiceRequest from './dispatchServiceRequest';
import respondentFound from './respondentFound';
import respondentNotFound from './respondentNotFound';
import databaseAskAffirmation from './databaseAskAffirmation';
import handleVote from './handleVote';
import { logPollSubject, startPoll } from "./poll";

import epicManager from '../../../think/Epic/index';

import { activeTalk } from '../../../communicate/communicate';

import asyncRoute from '../../../../../utils/asyncRoute'

import { sendMessage } from '../../../communicate/communicate'
import {
  CUSTOM_ACTION as extractFromCustomAction
} from '../../../util/extractDetail';
import {
  handleCustomActionError,
} from '../../../util/q';

import {  customActions } from '../../../../../constants/BotActions'

import { CUSTOM_ACTION } from '../../../../../constants/Format'

import logger from '../../../../../utils/logger';

const chooseCustomActions = async (body, action) => {
  console.log(body);
  try {
    const stage2_EpicId = await epicManager(body, CUSTOM_ACTION);
    let tasks = {
        reply: {
          action: ''
        },
        reverseCommands: []
      };
    logger.info(action);
    switch (action) {
      case 'action_dispatch_service_request':
      case 'service_request_form':
        tasks = await dispatchServiceRequest(body, stage2_EpicId);
        break;
      case 'action_handle_vote':
        tasks = await handleVote(body, stage2_EpicId);
        break;
      case 'action_respondent_found':
        tasks = await respondentFound(body, stage2_EpicId);
        break;
      case 'action_log_poll_subject':
        tasks = await logPollSubject(body, stage2_EpicId);
        break;
      case 'action_start_poll':
        tasks = await startPoll(body, stage2_EpicId);
        break;
      case 'action_respondent_not_found':
        tasks = await respondentNotFound(body);
        break;
      case 'action_database_ask_affirmation':
        tasks = await databaseAskAffirmation(body);
        break;
      default:
        break;
    }
    return { tasks, stage2_EpicId }
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
      console.log(body);

      const action = await extractFromCustomAction.action(body);

      const { tasks, stage2_EpicId }  = await chooseCustomActions(body, action);
      logger.info(JSON.stringify(tasks));
      logger.info(JSON.stringify(tasks.send))

      if('reply' in tasks){
        res.json({ ...tasks.reply, epic_id: stage2_EpicId });
      }
      else{
        res.json({
          action: '',
          epic_id: stage2_EpicId
        });
      }

      logger.info('1.1');

      if(typeof tasks.send !== 'undefined' && tasks.send !== null) {
        if(Array.isArray(tasks.send)){
          tasks.send.map(async s => {
            await sendMessage(s, stage2_EpicId);
          })
        }
        else {
          await sendMessage(tasks.send, stage2_EpicId);
        }
      }

      if(Array.isArray(tasks.reverseCommands)
        && tasks.reverseCommands.length > 0)
        await Promise.all(
          tasks.reverseCommands.map(async rc =>
            await activeTalk(rc, stage2_EpicId)
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

