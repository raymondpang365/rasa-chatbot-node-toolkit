import {
  startNewEpic,
  findExistingEpic
} from "./dbUtils";

import { updateUserUtterLogStoryId } from '../Message/utterLog';


export default async ({action, intent, utteranceId, contactId, roomId }) => {

    if (intent === 'service_request' || action ===  'action_database_ask_affirmation') {
      const {epicId, storyId} = await startNewEpic(contactId, roomId);
      await updateUserUtterLogStoryId(utteranceId, storyId);
      return {epicId, storyId};
    }
    else {
      const {epicId, storyId} = await findExistingEpic(contactId, roomId);
      await updateUserUtterLogStoryId(utteranceId, storyId);
      return {epicId, storyId};
    }

}
