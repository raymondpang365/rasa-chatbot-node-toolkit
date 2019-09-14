const cron = require('node-cron');

import logger from '../../../utils/logger';


//w2820697897

//Shiba: wxid_7kwo47d4iwtd22
//Teddy Bear: wxid_o7otxs0dq9bm22

import BotWrapper from './BotWapper';

let counter = 0;

const botStarter = cron.schedule('*/1 * * * *', async () => {
  counter++;

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
    logger.info('Reinitializing...')
    await BotWrapper.init()
  }
},
  {
    scheduled: false
  });

BotWrapper.init().then(()=> {
  botStarter.start();
}).catch(err => {
  logger.error(err);
});
