const wechat = require('src/chatbot/wechat');
const config = {
  token: 'anything',
  appid: 'wx60a9d1dab9935c04',
  //encodingAESKey: 'encodinAESKey',
  checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

import processMessage from './think/processLanguage/dialogFlowProcessor';

export default wechat(config, async (req, res, next) => {

  const message = req.weixin;
  const prefix = '@bot ';
  if(message.Content.substring(0, 5).toLowerCase() == prefix) {
    try {
      var responseMessage = await processMessage(message.Content.substring(5));

      return res.reply({
        content: responseMessage,
        type: 'text'
      });
    } catch (err) {
      console.log(err);
    }
  }
  return;
  /*
 console.log(message);
 return res.reply({
   content: message.Content + 'again',
   type: 'text'
 });*/
});
