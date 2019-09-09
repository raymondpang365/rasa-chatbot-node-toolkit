import logger from '../../../utils/logger';

import { passiveTalk } from '../../communicate/communicate';

import { bot as botToken,botId } from '../../../config/index'


const format = require('pg-format');

import { q, qNonEmpty } from '../../util/q'

import {
  config,
  Wechaty,
  Message,
  Contact,
  RoomInvitation,
  Friendship
} from 'wechaty'

import { PuppetPadpro } from 'wechaty-puppet-padpro'
import { Brolog as log } from 'brolog'

const initBot = (type) => {
  try {
    let puppet;
    switch (type) {
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
        console.log(botToken);
        const WECHATY_PUPPET_PADPRO_TOKEN = botToken;
        //wxid_bz4eto56p2g322 Raymond Pang x Orange bot integration

        puppet = new PuppetPadpro({
          token: WECHATY_PUPPET_PADPRO_TOKEN,
        });
        const bot = new Wechaty({puppet});
        return bot;
        break;
      case 3:
        return new Wechaty();
        break;
      default:
        break;

    }
  }
  catch(err){
    BotWrapper.setError(err);
    console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
    return null;
  }
};

const checkPlan = async (room) => {

      if(room !== null) {
        const topic = await room.topic();
        console.log(`room topic is : ${topic}`);

        const roomIdSqlRows = await q('SELECT * FROM room WHERE code = $1;', [room.id]);

        const roomId = roomIdSqlRows.length > 0 ? roomIdSqlRows[0].roomId : null;

        if (roomId !== null) {

          const {min_level} = (await qNonEmpty('SELECT min(p.plan_level) as min_level ' +
            'FROM plan p INNER JOIN subscription s ON p.id = s.plan_id WHERE s.room_id = $1 AND s.bot_id = $2 ' +
            'AND CURRENT_TIMESTAMP < s.end_timestamp',
            [roomId, this.contactId])).rows;

          if (isNaN(min_level)) {
            console.log('not activated')
            return;
          }
          else if (min_level === 0) {
            console.log('blacklisted')
            return;
          }
        }
        else{
          return
        }
      }

}

class BotWrapper{
  constructor(){
    this.bot = null;
    this.initiating = false;
    this.restarting = false;
    this.error = null;
    this.started = true;
    this.wxid = null;
    this.contactId = null;
  }

  bot(){
    return this.bot;
  }

  async syncContact(freetrial){

    const rooms = await this.bot.Room.findAll();

    const roomParams = [];
    rooms.map(r => roomParams.push([r.code]))
    const bulkInsertRoomSql = format('INSERT INTO room (code) VALUES %L RETURNING id, code;', roomParams);
    const dbRooms = (await qNonEmpty(bulkInsertRoomSql, [])).rows;
    const dbRoomMap = {};
    dbRooms.map(async r => {
      dbRoomMap[r.code] = r.id;

      await(q('INSERT INTO subscription (room_id, plan_id, subscription_start_timestamp, subscription_end_timestamp) ' +
        'VALUES ($1, 2, CURRENT_TIMESTAMP, Infinity) RETURNING id', [r.id]));

      if(freetrial){
        await(q("INSERT INTO subscription (room_id, plan_id, subscription_start_timestamp, subscription_end_timestamp) " +
          "VALUES ($1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + (1::text || ' month')::interval) RETURNING id",
          [r.id]));
      }
    });

    let roomContactCollection = {};
    let allContactParams = [];
    for(let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const contacts = await room.memberAll();
      let contactParams = [];
      contacts.map( c => contactParams.push([c.weixin()]));
      roomContactCollection = {
        ...roomContactCollection,
        [room.roomId]: contactParams
      };
      allContactParams = [...allContactParams, ...contactParams];
    }

    const bulkInsertContactSql = format('INSERT INTO contact (wxid) VALUES %L RETURNING id, wxid;',  allContactParams);
    const dbContacts = (await qNonEmpty( bulkInsertContactSql , [])).rows;
    const dbContactMap = {};
    dbContacts.map(c => {
      dbContactMap[c.wxid] = c.id;
    });

    const contactRoomParams = [];
    Object.keys(roomContactCollection).map(rc => {
      const contacts = roomContactCollection[rc];
      const roomId = dbRoomMap[rc];
      contacts.map(c => {
        const contactId = dbContactMap[c];
        contactRoomParams.push([contactId, roomId])
      })
    })

    const bulkInsertContactRoomSql = format('INSERT INTO contact_room (contact_id, room_id) VALUES %L;',  contactRoomParams);
    await qNonEmpty(bulkInsertContactRoomSql, [])
  }

  async init(){
    this.initiating = true;

    const bot = initBot(2);

    if(bot === null){
      this.initiating = false;
      return;
    }
    console.log(bot);
    console.log('HAHAHAHAHAHAAHAHAHAHAHAAHAHAHAHAHAAHAHAHAHAHAAHAHAHAHAHAAHAHAHAHAHAAHAHAHAHAHA')

    bot
      .on('scan', (qrcode, status) => {
        console.log('ON SCANNNNNNNNNNNN')
        const qrcodeImageUrl = [
          'https://api.qrserver.com/v1/create-qr-code/?data=',
          encodeURIComponent(qrcode),
        ].join('');
        console.log(qrcodeImageUrl);
        console.log(`${qrcode}\n[${status}] Scan QR Code in above url to login: `)
      })
      .on('login', async user => {
        log.info('Bot', `bot login: ${user}`)

        this.wxid = user.id;

        const botIdRows = (await q('SELECT id FROM contact WHERE wxid = $1', [this.wxid])).rows;

        if(botIdRows.length === 0){
          this.contactId = (await qNonEmpty('INSERT INTO contact (wxid) VALUES ($1) RETURNING id', [this.wxid])).rows[0].id;
        }
        else{
          this.contactId = botIdRows[0].id;
        }

      })
      .on('logout', user => {
        log.info('Bot', 'bot %s logout.', user)
      })
      .on('friendship', async friendship => {
        try {
          console.log(`received friend event.`)
          switch (friendship.type()) {

            // 1. New Friend Request

            case Friendship.Type.Receive:
              await friendship.accept();
              break;

            // 2. Friend Ship Confirmed

            case Friendship.Type.Confirm:
              console.log(`friend ship confirmed`);
              break;
          }
        } catch (e) {
          console.error(e)
        }
      })
      .on('room-invite', async roomInvitation => {
            try {
              console.log(`received room-invite event.`)

              const {auto_activate, freetrial } = await(qNonEmpty('SELECT auto_activate FROM global_setting WHERE id = $1',[1])).rows[0];

              if(auto_activate) {
                  await roomInvitation.accept();
                  await this.syncContact(freetrial);
              }
              else{
                  await(q('INSERT INTO room (code, activated) VALUES ($1) RETURNING id', [roomInvitation.roomId(), false])).rows[0].id;
              }

            } catch (e) {
              console.error(e)
            }
          })
      .on('message', async m => {
        console.log(m);

        if (m.self()) {
          return
        }

        /*
        if teddy bear is in production and shiba bot is in development
        When shiba bot speaks, do not treat shiba bot as user
         */
        if (!__DEV__) {
          const from = m.from()
          if (from && from.id === 'wxid_mpk305ilqx3712') {
            return;
          }
        }

        const room = m.room();

        if(room !== null) {
/*
          const roomIdSqlRows = await q('SELECT * FROM room WHERE code = $1;', [room.id]);
          const roomId = roomIdSqlRows.length > 0 ? roomIdSqlRows[0].roomId : null;
*/
          log.info('Bot', 'talk: %s', m);

          console.log(this.contactId)
          console.log(room.id)
          const alias = (await qNonEmpty('SELECT cr.room_alias FROM contact_room cr INNER JOIN room r ON cr.room_id = r.id WHERE cr.contact_id = $1 AND r.code = $2',
            [this.contactId, room.id])).rows[0].room_alias;

          const mentionPrefix = `@${alias}`;

          if (m.text().substring(0, mentionPrefix.length).toLowerCase() === mentionPrefix
            || (Array.isArray(m.payload.mentionIdList) && m.payload.mentionIdList.includes(this.wxid))) {

            let text = m.text().substring(mentionPrefix.length).trim();
            passiveTalk(m, text === "" ? "hi" : text);

          }
        }
        else {
          passiveTalk(m, m.text());
        }



      });

    bot.on('error', async e => {
      log.error('Bot', 'error: %s', e);
      logger.err(`Wechaty Error: ${e}`);
      if (bot.logonoff()) {
        console.log(e.message);
        await bot.say('Error').catch(console.error)
      }
    }
    );

    this.initiating = false;
    this.bot = bot;

    await this.start();
  }

  async start(){
    await this.bot.start()
      .then(() => {
        this.started = true;
      }).catch(async e => {
        log.error('Bot', 'init() fail:' + e);
        // process.exit(-1);
    });
  }

  async restart(){
    if(this.restarting){
      console.log('Already restarting...')
      return;
    }
    this.restarting = true;

    if(this.started === false){
      console.log("Bot initiated but not started");
    }
    if(!this.bot.logonoff()){
      console.log("Bot started but not logged in");
    }
    console.log('Restarting...');

    await this.bot.stop()
      .then(() => {
        this.started = false;
        console.log('Stopped temporarily to restart');
      })
      .catch(err => {
        console.log('Error when bot is stopping to restart. Fallback to reinitialization.');
        throw new Error(err)
      });
    await this.bot.start()
      .then(() => {
        this.started = true;
        this.restarting = false;
        console.log('restart success');
      })
      .catch(err => {
        console.log('Error when bot is restarting. Fallback to reinitialization.');
        throw new Error(err)
      });
  }
}

const botWrapper = new BotWrapper();

export default botWrapper;
