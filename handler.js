'use strict';
const axios = require('axios');

module.exports.run = async (event, context) => {
  const today = '2021-05-27';

  try {
    const response = await axios({
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
    });
    console.log(response);
    response.data.results.forEach(result => {
      console.log(JSON.stringify(result));
      console.log(result.properties.Name.title.map(x => x.plain_text).join());
    });
  } catch (error) {
    console.log(error);
  }
};
