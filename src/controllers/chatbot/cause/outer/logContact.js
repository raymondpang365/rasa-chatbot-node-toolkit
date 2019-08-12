import BotWrapper from './BotWapper'

import { Brolog as log } from 'brolog'

import logger from '../../../../utils/logger';

import { Contact } from 'wechaty'

export default async () => {
  const { bot } = BotWrapper;
  const contactList = await bot.Contact.findAll();

  log.info('Bot', '#######################');
  log.info('Bot', 'Contact number: %d\n', contactList.length)

  /**
   * official contacts list
   */

  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i];

    if (contact.type() === Contact.Type.Official) {
      logger.info(`official ${i}: ${contact.name()} : ${contact.id}`)
    }
  }

  /**
   *  personal contact list
   */

    for (let i = 0; i < contactList.length; i++) {
      const contact = contactList[i];
      if (contact.type() === Contact.Type.Personal) {
        logger.info(`personal ${i}: ${contact.name()} : ${contact.id}`)
      }
    }


}

const logPicture = async () => {

  const { bot } = BotWrapper;
  const contactList = await bot.Contact.findAll();

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
