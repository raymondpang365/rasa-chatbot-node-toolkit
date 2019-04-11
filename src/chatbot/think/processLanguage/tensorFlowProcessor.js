/*const { Wechaty, MsgType } = require('wechaty');
const request = require('request');

const bot = Wechaty.instance({ profile: 'tensorflow' });

bot.on('message', (message) => {
  if (!message.room() && !message.self() && message.type === MsgType.text) {
    // If it is not a group message nor message posted by self
    const content = message.content();
    request.post({
        url: 'http://localhost:5000/message',
        form: { msg: content }
      },
      (err, httpResponse, body) => {
        if (!err && body) {
          const data = JSON.parse(body);
          const response = data.text;
          console.log('message:', content, 'response:', response);
          message.say(response);
        }

      })
  }
});

bot.init(); */
