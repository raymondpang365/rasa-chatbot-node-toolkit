import Role from './role';
import botInitChat from '../initiate/inner/bot';
import userInitChat from '../initiate/outer/user';

import BotWrapper from '../cause/outer/BotWapper';
import { botUtterLog } from "../think/Message/utterLog";
import { BOT_MESSAGE as extractFromBotMessage } from '../util/extractDetail'

import logger from '../../../utils/logger';

import { Contact, Room } from 'wechaty';

const Roles = {};

const sendMessage = async (m, stage2_EpicId) => {

  logger.info(JSON.stringify(m));

  const to = extractFromBotMessage.wxid(m);
  logger.info('1.2');
  const room = extractFromBotMessage.roomId(m) || null;
  logger.info('1.3');
  const text = extractFromBotMessage.content(m) || '';
  logger.info('1.4');

  const wechatAction = {
    action: 'send',
    to,
    room,
    text,
    contact_card: 'contact_card' in m? m.contact_card : null
  };

  logger.info('1.5');

  let roleName = '';

  if (wechatAction.room === null) {
    roleName = wechatAction.to || '';
  }
  else {
    roleName = (wechatAction.to || '') + '#' + wechatAction.room;
  }

  if(!process.env.AUTOTEST) {
    if (!Roles[roleName]) {
      initNewRole(roleName, m)
    }

    logger.info('1.6');

    logger.info(JSON.stringify(wechatAction));

    Roles[roleName].dispatchWechatAction(wechatAction);
  }

  await botUtterLog(wechatAction, stage2_EpicId);

};

const activeTalk = async (reverseCommand, stage2_EpicId) => {
  try {
    logger.info('activeTalk!');
    let botMessages = await botInitChat(reverseCommand, stage2_EpicId);

    if (!Array.isArray(botMessages))
      botMessages = [botMessages];

    botMessages.map(async m => {
      await sendMessage(m, stage2_EpicId);
    });

    return true;
  }
  catch(err){
    throw err;
  }
};


const passiveTalk = (m, text) => {
  const from    = m.from();
  if (from === null) return;



  const fromId  = from && from.id;

  const room    = m.room();
  const roomId  = room && room.id;


  let roleName = '';

  if(room === null){
    roleName = fromId || '';
  }
  else{
    roleName = (fromId || '') + '#' + roomId;
  }
  if (!!Roles[roleName]) {
    console.log('girl logging m variable')
    console.log(Roles[roleName].m)
  }

  if (!Roles[roleName]) {
    initNewRole(roleName, m)
  }
  else if(Roles[roleName].m === null){
    Roles[roleName].setMessage(m);
  }

  let payload = {
    text: text,
    fromId,
    roomId: roomId || ''
  };

  Roles[roleName].hear(payload);

};

const initNewRole = (roleName, m = null) => {

  Roles[roleName] = new Role(function(payload) {
    return new Promise(async (resolve, reject) => { //think function
      try {
        const responseMessage = await userInitChat(payload);

        resolve(responseMessage);


      } catch (err) {
        reject(err);
      }
    })
  }, m);


  Roles[roleName].on('reply', response => {
    console.log('18138138138138138138138138138');
    console.log(Roles[roleName].m)

    if(Roles[roleName].m !== null){
      if(response.to !== null && response.room !== null){
        console.log(response.to);
        Roles[roleName].m.say(response.text, BotWrapper.bot.Contact.load(response.to));
      }
      else{
        Roles[roleName].m.say(response.text);
      }
    }
  });

  Roles[roleName].on('forward', response => {
    if(Roles[roleName].m !== null) Roles[roleName].m.forward(response.to)
  });

  Roles[roleName].on('send', async response => {

    try {
      console.log(response.room === null)

      let contactCard = null;

      if('contact_card' in response
        && typeof response.contact_card === 'string'
        && response.contact_card !== ''
      ){
        contactCard = await BotWrapper.bot.Contact.load(response.contact_card);
      }

      if (typeof response.text === 'string'){
        if(response.room === null){
          console.log(response.to)
          const target = await BotWrapper.bot.Contact.load(response.to);
          console.log(target);
          await target.say(response.text);
          if(contactCard !== null){
            await target.say(contactCard);
          }
        }
        else{
          const targetRoom = await BotWrapper.bot.Room.load(response.room);
          if(response.to === null || response.to === ''){
            await targetRoom.say(response.text);
            if(contactCard !== null){
              await targetRoom.say(contactCard);
            }
          }
          else{
            const targetContact = await BotWrapper.bot.Contact.load(response.to);
            await targetRoom.say(response.text, targetContact);
            if(contactCard !== null){
              await targetRoom.say(contactCard, targetContact);
            }
          }
        }
      }



    }catch(err){
      console.log(err);
    }
  });


};


export {
  passiveTalk,
  activeTalk,
  sendMessage,
  Roles
}
