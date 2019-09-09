// await-request.js
const requestModule = require('request');

export default async (value) =>
  new Promise((resolve, reject) => {
    requestModule.post(value, (error, response, data) => {
      if(error) reject(error)
      else resolve(data)
    })
  })
