import normalizeDetail from './normalizeDetail';
import { reverseCmdIntents } from '../../../../constants/Intents'

import policy from './policy'

export default async (params, format, inner) => {

  /**
   intent,
   utteranceId,
   defaultEpicId
   action,
   text,
   contactId,
   roomId
   */
    try {
      const detail = await normalizeDetail(params, format);

      if(inner === 'inner') {
        const {defaultEpicId, intent, contactId, roomId} = detail;
        if (defaultEpicId !== 0 || reverseCmdIntents.includes(intent)) {
          return defaultEpicId;
        }
      }
      else {
        return await policy(detail);
      }
    }
    catch (err) {
      throw err;
    }
}

