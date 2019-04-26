const extractMessage = m => {
  if(m.text().substring(0, 5).toLowerCase() === '@bot '){
    return m.text().substring(5);
  }else{
    return m.text();
  }
}

// await-request.js
const requestModule = require('request');

const request = async (value) =>
  new Promise((resolve, reject) => {
    requestModule.post(value, (error, response, data) => {
      if(error) reject(error)
      else resolve(data)
    })
  })

export {
  extractMessage,
  request
}
