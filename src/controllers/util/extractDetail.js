import {
  q,
  qNonEmpty
} from './q';

import {
  utterActions,
  reverseCmdUtterActions,
  customActions
} from '../../constants/BotActions'

import logger from '../../utils/logger';

const extractWxidFromCustomAction = (body) => {
  const convId = (typeof body.sender === 'string') ? body.sender : '';

  return body.sender.indexOf('#') > -1 ? body.sender.split('#')[0] : convId;
};

const extractWxidFromBotMessage = payload => {
  if(typeof payload.recipient_id !== 'string'){
    return '';
  }
  const convId = payload.recipient_id;
  return payload.recipient_id.indexOf('#') > -1 ? payload.recipient_id.split('#')[0] : convId;
};

const extractWxidFromUserMessage = payload => {
  const convId = (typeof payload.sender === 'string') ? payload.sender : '';
  return payload.sender.indexOf('#') > -1 ? payload.sender.split('#')[0] : convId;
};

const extractUtteranceIdFromCustomAction = body=> {
  return parseInt(body.slots.utterance_id);
}

const extractUtteranceIdFromBotMessage = payload=> {
  const { text } = payload;
  const prefix = text.substring(0, text.indexOf('|'));
  const u_at = prefix.indexOf('u');
  const e_at = prefix.indexOf('e');
  const answer  =prefix.substring(e_at + 1, u_at).trim();
  console.log(`bot message:${answer}.`);
  return parseInt(answer);
}

const extractUtteranceIdFromNluMessage = payload=> {
  const { text } = payload;
  const prefix = text.substring(0, text.indexOf('|'));
  const u_at = prefix.indexOf('u');
  const e_at = prefix.indexOf('e');
  const answer  =prefix.substring(e_at + 1, u_at).trim();
  console.log(`bot message:${answer}.`);
  return parseInt(answer);
}

const NLU_MESSAGE = {
  content: body => {
    const { text } = body;
    return text.substring(text.indexOf('|')+1).trim();
  },
  sender: async body => {
    const utteranceId = extractUtteranceIdFromNluMessage(body)
    const result = await qNonEmpty('SELECT u.contact_id, c.wxid, u.room_id FROM contact c INNER JOIN utterance u ON c.id = u.contact_id WHERE u.id = $1',
      [utteranceId]);
    console.log(result)

    const roomId = result.rows[0].room_id;
    const wxid = result.rows[0].wxid;

    const senderIdRoom = typeof roomId === 'string' && roomId.length > 0
      ? `#${roomId}` : '' ;
    const senderIdWxid = wxid || ''
    return {
      wxid: result.rows[0].wxid,
      contactId: parseInt(result.rows[0].contact_id),
      roomId: result.rows[0].room_id,
      senderId: `${senderIdWxid}${senderIdRoom}`
    }
  },
  wxid: async body => {
    const utteranceId = extractUtteranceIdFromNluMessage(body)
    const result = await qNonEmpty('SELECT c.wxid FROM contact c INNER JOIN utterance u ON c.id = u.contact_id WHERE u.id = $1',
      [utteranceId]);
    console.log(result)
    return parseInt(result.rows[0].wxid);
  },
  roomId: async body => {
    const utteranceId = extractUtteranceIdFromNluMessage(body)
    const result = await qNonEmpty('SELECT room_id from utterance u WHERE id = $1',
      [utteranceId]);
    console.log(result)
    return result.rows[0].room_id;
  },
  contactId: async (body) => {
    const utteranceId = extractUtteranceIdFromNluMessage(body)
    const result = await qNonEmpty('SELECT contact_id from utterance u WHERE id = $1',
      [utteranceId]);
    console.log(result)
    return parseInt(result.rows[0].contact_id);
  },
  epicId: body => {
    const { text } = body;
    const prefix = text.substring(0, text.indexOf('|'));
    return parseInt(text.substring(0, prefix.indexOf('e')).trim());
  },
  utteranceId: body => extractUtteranceIdFromNluMessage(body),
  entities: (body, name) => {
    const entityResult = body.entities.filter(e =>
      e.entity === name
    );
    if(entityResult.length === 0){
      return null;
    }
    else{
      return entityResult[0].value;
    }
  },
  intent: async (body) => {
    return body.intent
  }
};



const CUSTOM_ACTION = {
  content: body => {
    const { text } = body;
    return text.substring(text.indexOf('|')+1);
  },
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
    return parseInt(body.slots.epic_id);
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
  },
  extraParams: body => {
    return 'extra_params' in body ? body.extra_params: null;
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
    console.log(payload);
    if(typeof payload.recipient_id !== 'string'){
      logger.error('recipient_id is not a string')
      return null;
    }
    return payload.recipient_id.indexOf('#') > -1 ? payload.recipient_id.split('#')[1] : null;
  },
  epicId: payload => {
    const { text } = payload;
    const prefix = text.substring(0, text.indexOf('|'));
    return parseInt(text.substring(0, prefix.indexOf('e')).trim());
  },
  insertNewEpicId: (epicId, payload) => {
    console.log(epicId);
    console.log(payload);
    const { text } = payload;
    const prefix = text.substring(0, text.indexOf('|'));
    const suffix = text.substring(prefix.indexOf('e')).trim();
    return `${epicId} ${suffix}`;
  },
  utteranceId: payload => extractUtteranceIdFromBotMessage(payload),
  action: async payload=> {
    const utteranceId = extractUtteranceIdFromBotMessage(payload);
    if(isNaN(utteranceId)){
      return null;
    }
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
    console.log(payload);
    console.log(utteranceId);
    const intentRows = (await q('SELECT intent_name FROM events WHERE utterance_id = $1 AND intent_name IS NOT NULL', [utteranceId])).rows;
    const intent = (intentRows.length > 0)? intentRows[0].intent_name : '';
    console.log(intent)
    return intent;
  },
  content: payload => {
    const { text } = payload;
    return text.substring(text.indexOf('|')+1);
  }
};

const USER_MESSAGE = {
  wxid: payload => extractWxidFromUserMessage(payload),
  contactId: async payload => {
    const enquirerWxid = extractWxidFromUserMessage(payload);
    const result = await qNonEmpty('SELECT id from contact WHERE wxid = $1',
      [enquirerWxid]);
    return parseInt(result.rows[0].id);
  },
  roomId: payload => {
    return payload.sender.indexOf('#') > -1 ? payload.sender.split('#')[1] : null;
  },
  content: payload => {
    return payload.message
  }
};

module.exports = {
  NLU_MESSAGE,
  CUSTOM_ACTION,
  BOT_MESSAGE,
  USER_MESSAGE
}
