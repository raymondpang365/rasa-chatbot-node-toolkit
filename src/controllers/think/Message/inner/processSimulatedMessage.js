import processMessage from '../processMessage'

export default async ({ payload, utteranceId = 0, epicId = 0 }) => {

  try {

    const formData =  {
      sender: payload.sender,
      message: `${epicId} e ${utteranceId} u| ${payload.message}`
    };
    console.log(formData);

    const message = await processMessage(formData);
    console.log(message);

    if(message.data.length === 0) {
      return null;
    }
    else {
      const botMessage = message.data[0];
      console.log(botMessage);

      return botMessage;
    }
  }
  catch(err){
    throw new Error(err);
  }
}
