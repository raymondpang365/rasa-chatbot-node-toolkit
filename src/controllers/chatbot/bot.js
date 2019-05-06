const QrcodeTerminal = require('qrcode-terminal');

import { Brolog as log } from 'brolog'

import { passiveTalk } from './communicate';

import {
  config,
  Wechaty,
  Message,
  Contact
} from 'Wechaty'

import { PuppetPadpro } from 'wechaty-puppet-padpro'


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
      const WECHATY_PUPPET_PADCHAT_TOKEN = 'puppet_padchat_baac2cfed6c03757';

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
      const WECHATY_PUPPET_PADPRO_TOKEN = 'puppet_padpro_75d1a03c2984967b';
      //wxid_bz4eto56p2g322 Raymond Pang x Orange bot integration

      puppet = new PuppetPadpro({
        token: WECHATY_PUPPET_PADPRO_TOKEN,
      });
      return new Wechaty({puppet});

      break;

    case 3:
      const { PuppetIoscat } = require('wechaty-puppet-ioscat');
      puppet =  new PuppetIoscat({
        token: 'wxid_mpk305ilqx3712' //Shiba
          //'w2820697897' //Pang King Lo
      });
      return new Wechaty({puppet});
      break;
    case 4:
      return new Wechaty();
      break;
    default:
      break;

  }
};

const bot = initBot(2);

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

    log.info('Bot', `bot login: ${user}`)
  })
  .on('logout' , user => log.info('Bot', 'bot %s logout.', user))
  .on('message', async m => {
    if (m.self()){
      console.log(m);
      return }

    const room = m.room();

    if (room){
      const topic = await room.topic();
      console.log(`room topic is : ${topic}`);
      if(topic.includes('骏皇名居')) {
        return;
      }
    }

    log.info('Bot', 'talk: %s'  , m);
    const prefix = '@bot ';



      if (room === null || m.text().substring(0, 5).toLowerCase() === prefix) {
        console.log(typeof passiveTalk);
        console.log(m);
        passiveTalk(m);
      }


  });

bot.start()
  .catch(async e => {
    log.error('Bot', 'init() fail:' + e)
    await bot.stop()
    process.exit(-1)
  });

export default bot;
