import Role from './role';
import think from './think/index';
import extractMessage from "./util/messageFilter";
import bot from './bot';
import { BOT_MESSAGE as extractFromBotMessage } from './util/extractDetail'

const Roles = {};

const activeTalk = botMessages => {

  botMessages.map(m => {

    const to = extractFromBotMessage.wxid(m);
    const room = extractFromBotMessage.roomId(m) || null;
    const text = extractFromBotMessage.content(m) || '';

    let roleName = '';

    if(room === null){
      roleName = to || '';
    }
    else{
      roleName = (to || '') + '#' + room;
    }

    if (!Roles[roleName]) {
      initNewRole(roleName)
    }

    const task = {
      action: 'send',
      text,
      room,
      to
    };

    Roles[roleName].dispatchWechatAction(task);

  });


};

const passiveTalk = m => {
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
    text: extractMessage(m),
    fromId,
    roomId: roomId || ''
  };

  Roles[roleName].hear(payload);

};

const initNewRole = (roleName, m = {}) => {

  Roles[roleName] = new Role(function(payload) {
    return new Promise(async (resolve, reject) => { //think function
      try {
        const responseMessage = await think(payload);

        resolve(responseMessage);


      } catch (err) {
        reject(err);
      }
    })
  });


  Roles[roleName].on('reply', response => {
    console.log(Roles[roleName].m)
    if(Roles[roleName].m !== null) Roles[roleName].m.say(response.text)

  });

  Roles[roleName].on('forward', response => {
    if(Roles[roleName].m !== null) Roles[roleName].m.forward(response.to)
  });

  Roles[roleName].on('send', async response => {

    try {
      console.log(response.room === null)
      const target = (response.room === null)
        ? await bot.Contact.load(response.to)
        : await bot.Room.load(response.room);

      if (typeof response.text === 'string')
        await target.say(response.text);

      if('contact_card' in response
        && typeof response.contact_card === 'string'
        && response.contact_card !== ''
      ){
        const contactCard = await bot.Contact.load(response.contact_card);
        await target.say(contactCard);
      }

    }catch(err){
      console.error(err);
    }
  });


};


export {
  passiveTalk,
  activeTalk,
  Roles
}
