const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');

const axios = require('axios');

const { loadMovieTemplate } = require('../helpers/templates');
const { makeURI, generateSearchUrl, generateDetailSearchUrl } = require('../helpers/additionalFunctions');

module.exports = async (ctx) => {
  const chatId = ctx.message.chat.id;
  const db = low(adapter);
  const user = db.get('users').find({id: ctx.from.id}).value();

  let movieName = makeURI(ctx);
  let searchUrl = generateSearchUrl('movie', movieName, lang=user.lang);

  // Reset previous results
  if (ctx.session.state) {
    let messageId = ctx.session.state.lastMessageId.toString();
    ctx.telegram.deleteMessage(chatId, messageId);
  }
  ctx.session.state = {};

  let data;

  axios.get(searchUrl).then((res) => {
    let movieIds = [];

    if (!res.data) {
      ctx.telegram.sendMessage(chatId, 'No movie found');
    }else {
      data = JSON.parse(JSON.stringify(res.data));

      movieIds = data.results.map((res) => {
        return res.id;
      });
    }

    let itemsProcessed = 1;
    data.results = [];

    async function getDetailedData() {
      for (const id of movieIds) {
        let detailUrl = generateDetailSearchUrl('movie', id, lang=user.lang);
        await axios.get(detailUrl).then((res) => {
          data.results.push(res.data);
          if (itemsProcessed === movieIds.length) {
            loadMovieTemplate(ctx, chatId, data);
          }
          itemsProcessed++;
        }).catch((err) => {
            console.log(err);
        })
      }
    }
    getDetailedData();

  }).catch((err) => {
    console.log(err);
    ctx.telegram.sendMessage(chatId, 'No movie found');
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    }
  });
}
// TODO: добавить кнопку поиска похожих фильмов к каждому результату
