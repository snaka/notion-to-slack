'use strict';
const axios = require('axios');

module.exports.run = async (event, context) => {
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);

  const today = '2021-05-27';

  axios({
    method: 'post',
    url: `https://api.notion.com/v1/databases/${process.env.DATABASE_ID}/query`,
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2021-05-13',
      'Content-Type': 'application/json',
    },
    data: {
      filter: {
        property: 'Date',
        date: {
          equals: today,
        },
      },
    }
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error);
  });
};
