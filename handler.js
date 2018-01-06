'use strict';

const request = require('axios');
const {getCurrentWPVer} = require('./helper');

module.exports.hello = (event, context, callback) => {

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };


  request('https://wordpress.org/download/')
    .then(({data}) => {
      const ver = getCurrentWPVer(data);
      callback(null, {ver});
    })
    .catch(callback);
  // callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
