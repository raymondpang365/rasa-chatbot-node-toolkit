import * as extractDetailFunctions from '../../util/extractDetail'

import Format from '../../../constants/Format'

export default async (params, format) => {

  if(!Object.keys(Format).includes(format))
    throw new Error(`Invalid format ${format}`);

  const extract = extractDetailFunctions[format];

  const defaultEpicId = parseInt(extract.epicId(params));
  const intent =  await extract.intent(params);
  const action =  await extract.action(params);
  const utteranceId = extract.utteranceId(params);
  const contactId = await extract.contactId(params);
  const roomId = await extract.roomId(params);
  console.log(utteranceId);
  return {
    defaultEpicId, action, intent, utteranceId, contactId, roomId
  }
}
