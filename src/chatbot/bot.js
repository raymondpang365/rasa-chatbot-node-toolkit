const QrcodeTerminal = require('qrcode-terminal');

import { Brolog as log } from 'brolog'

import { extractMessage } from "./util";

import Role from './role';

import {
  config,
  Wechaty,
  Message,
  Contact
} from 'Wechaty'


import think from './think';

// log.level = 'verbose'
// log.level = 'silly'
//w2820697897

//wxid_7kwo47d4iwtd22


async function main() {
  const contactList = await bot.Contact.findAll();

  log.info('Bot', '#######################');
  log.info('Bot', 'Contact number: %d\n', contactList.length)

  /**
   * official contacts list
   */
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i];
    console.log(contact);

  //  const weixin = await  contact.weixin();
    console.log(weixin);
    /*
    if (contact.type() === Contact.Type.Official) {
      log.info('Bot', `official ${i}: ${contact}`)
    }*/
  }

  /**
   *  personal contact list
   */
/*
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i];
    if (contact.type() === Contact.Type.Personal) {
      log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
    }
  }
*/
  const MAX = 17;
  for (let i = 0; i < contactList.length; i++ ) {
    const contact = contactList[i];

    /**
     * Save avatar to file like: "1-name.jpg"
     */
    const file = await contact.avatar();
    const name = file.name;
    await file.toFile(name, true);

    log.info('Bot', 'Contact: "%s" with avatar file: "%s"',
      contact.name(),
      name,
    );

    if (i > MAX) {
      log.info('Bot', 'Contacts too many, I only show you the first %d ... ', MAX)
      break
    }
  }

  const SLEEP = 7;
  log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
  setTimeout(main, SLEEP * 1000)

}

const initBot = type => {
  let puppet;
  switch(type) {
    case 1:
   /*   const { PuppetPadpro } = require('wechaty-puppet-padpro');
      const WECHATY_PUPPET_PADPRO_TOKEN = 'puppet_padchat_baac2cfed6c03757';
      //wxid_bz4eto56p2g322 Raymond Pang x Orange bot integration

      puppet = new PuppetPadpro({
        token: WECHATY_PUPPET_PADPRO_TOKEN,
      });
      return new Wechaty({puppet});*/

      const WECHATY_PUPPET_PADCHAT_TOKEN = 'puppet_padchat_baac2cfed6c03757'

      puppet = 'wechaty-puppet-padchat' // 使用ipad 的方式接入。

      const puppetOptions = {
        token: WECHATY_PUPPET_PADCHAT_TOKEN,
      };

      return new Wechaty({
        puppet,
        puppetOptions,
      });
      break;

    case 2:
      const { PuppetIoscat } = require('wechaty-puppet-ioscat');
      puppet =  new PuppetIoscat({
        token: 'wxid_mpk305ilqx3712' //Shiba
          //'w2820697897' //Pang King Lo
      });
      return new Wechaty({puppet});
      break;
    case 3:
      return new Wechaty();
      break;
    default:
      break;

  }
};

const bot = initBot(1);

import opn from 'opn';

bot
  .on('scan', (qrcode, status) => {

    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('');
    opn(qrcodeImageUrl);
    console.log(`${qrcode}\n[${status}] Scan QR Code in above url to login: `)
  })
  .on('login'  , async user => {
   // await main();

    const contact = await bot.Contact.find({name: '萦爸'});
   // const contact = await bot.Contact.find({alias: 'Bb'});

   const weixin = await contact.weixin();
    console.log(contact);
    console.log(weixin);
    log.info('Bot', `bot login: ${user}`)
  })
  .on('logout' , user => log.info('Bot', 'bot %s logout.', user))
  .on('message', async m => {
    if (m.self()){
      console.log(m);
      return }

   // if(m.topic().startsWith('骏皇名居')){ return }

    // co(function* () {
    //   const msg = yield m.load()
    const room = m.room();

    if (room){
      const topic = await room.topic();
      console.log(`room topic is : ${topic}`);
      if(topic.includes('骏皇名居')) {
        return;
      }
    }

    console.log(m);


    log.info('Bot', 'talk: %s'  , m);
    const prefix = '@bot ';

    if(room === null || m.text().substring(0, 5).toLowerCase() === prefix) {
      talk(m);
    }

  });

bot.start()
  .catch(async e => {
    log.error('Bot', 'init() fail:' + e)
    await bot.stop()
    process.exit(-1)
  });



/* tslint:disable:variable-name */
const Roles = {};

function talk(m) {
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
    roleName = roomId + (fromId || '');
  }

  if (!Roles[roleName]) {
    Roles[roleName] = new Role(function(payload) {
      return new Promise(async (resolve, reject) => { //think function
          try {
            const responseMessage = await think(payload);
            console.log(responseMessage);
            resolve(responseMessage);


          } catch (err) {
            reject(err);
          }
      })
    });

    Roles[roleName].on('reply', response => m.say(response.message));
    Roles[roleName].on('send', async response => {
      console.log('hehe');
      console.log(response);
      const {message} = response;
      try {
        if (typeof message === 'string') {
          const result = await m.puppet.messageSendText({
            contactId: response.to || undefined,
            roomId: response.room || undefined,
          }, response.message);

          console.log(result);
        }
      }catch(err){
        throw new Error(err);
      }
    });
    Roles[roleName].on('forward', response => m.forward(response.to));

  }
  console.log(extractMessage(m));
  console.log('beforepayload');
  let payload = {
    text: extractMessage(m),
    fromId,
    roomId: roomId || ''
  };

  Roles[roleName].hear(payload);
}

