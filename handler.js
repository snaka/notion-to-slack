'use strict';
const axios = require('axios');
const { IncomingWebhook } = require('@slack/webhook');

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

module.exports.run = async (event, context) => {
  const { databaseId, channel } = await getMessageConfig();

  // 本来は日本時間で判定しないといかないが面倒なのでUTCのまま
  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  try {
    const response = await fetchPagesOnDate(databaseId, today);
    response.data.results.forEach(async result => {
      const text = result.properties.Name.title.map(x => x.plain_text).join();
      console.log(text);
      await webhook.send({
        channel,
        text,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// 設定用ページのプロパティを読み込む
async function getMessageConfig() {
  const response = await axios({
    method: 'get',
    url: `https://api.notion.com/v1/pages/${process.env.CONFIG_PAGE_ID}`,
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2021-05-13',
    },
  });
  console.log(response);
  return Promise.resolve({
    channel: '#random',
    databaseId: '2b6991f019f643feb5a2bc27a4f37d8e',
  });
}

// データベースから対象日のページを取得
async function fetchPagesOnDate(databaseId, targetDate) {
  const response = await axios({
    method: 'post',
    url: `https://api.notion.com/v1/databases/${databaseId}/query`,
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2021-05-13',
      'Content-Type': 'application/json',
    },
    data: {
      filter: {
        property: 'Date',
        date: {
          equals: targetDate,
        },
      },
    }
  });
  return response;
}
