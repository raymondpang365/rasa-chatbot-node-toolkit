const QrcodeTerminal = require('qrcode-terminal');
const cron = require('node-cron');

import { Brolog as log } from 'brolog'


import { finis } from 'finis';

// log.level = 'verbose'
 log.level = 'silly';
//w2820697897

//Shiba: wxid_7kwo47d4iwtd22
//Teddy Bear: wxid_o7otxs0dq9bm22

import BotWrapper from './BotWapper';

let counter = 0;

const botStarter = cron.schedule('*/1 * * * *', async () => {
  counter++;
  //console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
  //console.log(BotWrapper.initiating)


  try {
    if (BotWrapper.bot === null) {
      if(BotWrapper.initiating) {
        console.log('Already reinitializing...');
        return;
      }
      BotWrapper.initiating = true;
      throw new Error("BotWrapper.bot is null.");
    }
    else if(BotWrapper.started === false || !BotWrapper.bot.logonoff()){
      await BotWrapper.restart();
    }
  }
  catch(err){
    console.log('Reinitializing...')
    await BotWrapper.init()
  }
},
  {
    scheduled: false
  });

BotWrapper.init().then(()=> {
  botStarter.start();
}).catch(err => {
  console.log('main error');
  console.log(err);
});


/*

let killChrome;
let quiting = false;
let done = false;

const checkForExit = () => {
  // if (checkNum++ % 100 === 0) {
  log.info('Bot', 'finis() checkForExit() checking done: %s', done);
  // }
  if (done) {
    log.info('Bot', 'finis() checkForExit() done!');
    setTimeout(() => doExit(code), 1000); // delay 1 second
    return
  }
  // death loop to wait for `done`
  // process.nextTick(checkForExit)
  // setImmediate(checkForExit)
  setTimeout(checkForExit, 100)
}

const doExit = (code) => {
  log.info('Bot', 'doExit(%d)', code)
  if (killChrome) {
    killChrome('SIGINT')
  }
  process.exit(code)
}
*/


/*
finis(async (code, signal) => {
  log.info('Bot', 'finis(%s, %s)', code, signal);

  if (!BotWrapper.bot.logonoff()) {
    log.info('Bot', 'finis() bot had been already stopped')
    doExit(code)
  }
  if (quiting) {
    log.warn('Bot', 'finis() already quiting... return and wait...')
    return
  }

  quiting = true;

  const exitMsg = `Wechaty will exit ${code} because of ${signal}`;

  log.info('Bot', 'finis() broadcast quiting message for bot');
  await BotWrapper.bot.say(exitMsg)
  // .then(() => bot.stop())
    .catch(e => log.error('Bot', 'finis() catch rejection: %s', e))
    .then(() => done = true);

  setImmediate(checkForExit);
});
*/

