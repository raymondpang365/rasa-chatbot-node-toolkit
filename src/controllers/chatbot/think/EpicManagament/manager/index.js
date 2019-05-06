import normalizeDetail from './normalizeDetail';
import { reverseCmdIntents } from '../../../../../constants/Intents'

import policy from '../policy'

export default async (params, format) => {

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

      const {defaultEpicId, intent } = detail;
      if (defaultEpicId !== 0 || reverseCmdIntents.includes(intent)){
        return defaultEpicId;
      }

      return await policy(detail);
    }
    catch (err) {
      throw err;
    }
}

