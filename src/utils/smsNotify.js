import request from 'request';
import { fcmServerKey } from '../config';

const fs = require('fs');

// retrieve fcm_token from database
const smsNotify = (fcmTokens, message) => {
  const options = {
    uri: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: { 'Authorization': `key=${fcmServerKey}` },
    json: {
        'registration_ids': fcmTokens.map(fcmToken => fcmToken.token ),
        'priority': 'high',
        'data': { 'title': message, 'body': message }
      }
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      fs.writeFile("/log/fcm", response)
    } else {
      fs.writeFile("/log/fcm", error)
    }
  });
};

export default smsNotify;
