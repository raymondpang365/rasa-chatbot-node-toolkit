import {
  startNewEpic,
  findExistingEpic
} from "./dbUtils";

import { updateUserUtterLogEpicId } from '../Message/utterLog';


export default async ({action, intent, utteranceId, contactId, roomId }) => {

    if (intent === 'service_request' || action ===  'action_database_ask_affirmation') {
      const epicId = await startNewEpic(contactId, roomId);
      await updateUserUtterLogEpicId(utteranceId, epicId);
      return epicId;
    }
    else {
      const epicId = await findExistingEpic(contactId, roomId);
      await updateUserUtterLogEpicId(utteranceId, epicId);
      return epicId;
    }

}
