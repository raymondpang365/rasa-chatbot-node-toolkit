import {
  dbUpdateStoryId,
  startNewEpic,
  findExistingEpic
} from "./manager/dbUtils";


export default async ({intent, utteranceId, contactId, roomId }) => {
  if (intent === 'service_request') {
    const {epicId, storyId} = await startNewEpic(contactId, roomId);
    await dbUpdateStoryId(utteranceId, storyId);
    return epicId;
  }
  else {
    const {epicId, storyId} = await findExistingEpic(contactId, roomId);
    await dbUpdateStoryId(utteranceId, storyId);
    return epicId;
  }
}
