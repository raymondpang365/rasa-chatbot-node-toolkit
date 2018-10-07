import request from 'request';

export default{

  subscribe: async ({ email }) => {

    const data = {
      email_address: email,
      status: 'subscribed',
    };
    const listId = 'd5bbf5c91d';
    const API_KEY = '123ca460181b7592af5cc4749ef5f87f-us19';
    await new Promise((resolve, reject) => {
      request.post(
        {
          uri: `https://us19.api.mailchimp.com/3.0/lists/${listId}/members/`,
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from(`apikey:${API_KEY}`).toString('base64')}`,
          },
          json: true,
          body: data,
        },
        (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        },
      );
    });
  }
}
