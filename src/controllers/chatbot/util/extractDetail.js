import {
  q,
  qNonEmpty
} from './q';

import {
  utterActions,
  reverseCmdUtterActions,
  customActions
} from '../../../constants/BotActions'

const extractWxidFromCustomAction = (body) => {
  const convId = (typeof body.sender === 'string') ? body.sender : '';

  return body.sender.indexOf('#') > -1 ? body.sender.split('#')[0] : convId;
};

const extractWxidFromBotMessage = payload => {
  const convId = (typeof payload.recipient_id === 'string') ? payload.recipient_id : '';
  return payload.recipient_id.indexOf('#') > -1 ? payload.recipient_id.split('#')[0] : convId;
};

const extractWxidFromUserMessage = payload => {
  const convId = (typeof payload.sender === 'string') ? payload.sender : '';
  return payload.sender.contains('#') ? payload.sender.split('#')[0] : convId;
};

const extractUtteranceIdFromCustomAction = body=> {
  const text = body.text;
  const prefix = text.substr(0, text.indexOf('|'));
  const u_at = prefix.indexOf('u');
  const e_at = prefix.indexOf('e');
  return parseInt(text.substr(e_at + 1, u_at - 2).trim());
}

const extractUtteranceIdFromBotMessage = payload=> {
  const { text } = payload;
  const prefix = text.substr(0, text.indexOf('|'));
  const u_at = prefix.indexOf('u');
  const e_at = prefix.indexOf('e');
  const utteranceId =parseInt(text.substr(e_at + 1, u_at - 2).trim());
  console.log(utteranceId);
  return utteranceId;
}


const CUSTOM_ACTION = {
  wxid: body => extractWxidFromCustomAction(body),
  contactId: async (body) => {
    const enquirerWxid = extractWxidFromCustomAction(body)
    console.log(enquirerWxid);
    const result = await qNonEmpty('SELECT id from contact WHERE wxid = $1',
      [enquirerWxid]);
    console.log(result)
    return parseInt(result.rows[0].id);
  },
  roomId: (body) => {
    return body.sender.indexOf('#') > -1 ? body.sender.split('#')[1] : null;
  },
  epicId: body => {
    const text = body.text;
    const prefix = text.substr(0, text.indexOf('|'));
    return parseInt(text.substr(0, prefix.indexOf('e')).trim());
  },
  utteranceId: body => extractUtteranceIdFromCustomAction(body),
  slots: (body, keyArray) => {
    if(!Array.isArray(keyArray))
      keyArray = [keyArray];

    return keyArray.map(k => body.slots[k] || null);
  },
  action: async (body) => {
    return body.action
  },
  intent: async (body) => {
    return body.intent
  }
};

const BOT_MESSAGE = {
  wxid: payload => extractWxidFromBotMessage(payload),
  contactId: async payload => {
    const enquirerWxid = extractWxidFromBotMessage(payload);
    console.log(enquirerWxid);
    const result = (
      await qNonEmpty(
        'SELECT DISTINCT id from contact WHERE wxid = $1',
        [enquirerWxid]
      )
    ).rows[0].id;
    return parseInt(result);
  },
  roomId: payload => {
    return payload.recipient_id.indexOf('#') > -1 ? payload.recipient_id.split('#')[1] : null;
  },
  epicId: payload => {
    const { text } = payload;
    const prefix = text.substr(0, text.indexOf('|'));
    return parseInt(text.substr(0, prefix.indexOf('e')).trim());
  },
  insertNewEpicId: (epicId, payload) => {
    console.log(epicId);
    console.log(payload);
    const { text } = payload;
    const prefix = text.substr(0, text.indexOf('|'));
    const suffix = text.substr(prefix.indexOf('e')).trim();
    return `${epicId} ${suffix}`;
  },
  utteranceId: payload => extractUtteranceIdFromBotMessage(payload),
  action: async payload=> {
    const utteranceId = extractUtteranceIdFromBotMessage(payload);
    const rows = (await q('SELECT action_name FROM events WHERE utterance_id = $1 AND action_name IS NOT NULL', [utteranceId])).rows;
    let action = '';
    const allActions = [...utterActions, ...reverseCmdUtterActions, ...customActions];
    for(let i = 0; i < rows.length; i++){
      if(allActions.includes(rows[i].action_name)) {
        action = rows[i].action_name;
        break;
      }
    }
    console.log(action);
    return action;
  },
  intent: async payload=> {
    const utteranceId = extractUtteranceIdFromBotMessage(payload);
    const intent = (await q('SELECT intent_name FROM events WHERE utterance_id = $1 AND intent_name IS NOT NULL', [utteranceId])).rows[0].intent_name;
    console.log(intent)
    return intent;
  },
  content: payload => {
    const { text } = payload;
    return text.substr(text.indexOf('|')+1);
  }
};

const USER_MESSAGE = {
  wxid: payload => extractWxidFromUserMessage(payload),
  contactId: async payload => {
    const enquirerWxid = extractWxidFromUserMessage(payload);
    const result = await this.qNonEmpty('SELECT id from contact WHERE wxid = $1',
      [enquirerWxid]);
    return parseInt(result.rows[0].id);
  },
  roomId: payload => {
    return payload.sender.indexOf('#') > -1 ? payload.sender.split('#')[1] : null;
  }
};

module.exports = {
  CUSTOM_ACTION,
  BOT_MESSAGE,
  USER_MESSAGE
}
