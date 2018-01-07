'use strict';

const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const Nexmo = require('nexmo')
const { differenceWith, isEqual } = require('lodash');
const { getCurrentWPVer } = require('./helper');

module.exports.scrape = (event, context, callback) => {


let todayVer, dbVer, scrapedSameAsYestarday;

  request('https://wordpress.org/download/')
    .then(({data}) => {
      todayVer = getCurrentWPVer(data);

      // get yesterday's WP ver
      return dynamo.scan({
        TableName: 'wpVer'
      }).promise();

    })
    .then(dbResp => {

      let yesterdayWpVer = dbResp.Items[0] ? dbResp.Items[0].ver : [];

      scrapedSameAsYestarday = (todayVer == yesterdayWpVer)

      if(scrapedSameAsYestarday) {
        callback(null, {
          response: 'nothing changed! Current ver is still: ' + todayVer
        })
      }
      if (!scrapedSameAsYestarday) {
        let recordToDelete = dbResp.Items[0] ? dbResp.Items[0].listingId : null

        if(recordToDelete) {
          return dynamo.delete({
            TableName: 'wpVer',
            Key: {
              listingId: recordToDelete
            }
          }).promise()
        } else return;
      }
    })
    .then(() => {
      if(!scrapedSameAsYestarday) {
        return dynamo.put({
          TableName: 'wpVer',
          Item: {
            listingId: new Date().toString(),
            ver: todayVer
          }
        }).promise()
      }
    })
    .then(() => {
      if(!scrapedSameAsYestarday) {


        callback(null, {
          message: 'new version released!',
          ver: todayVer
        });
      }

    })
    .catch(callback);
};
