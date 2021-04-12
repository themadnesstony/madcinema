const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');

const axios = require('axios');

const { loadMovieTemplate } = require('../helpers/templates');
const { makeURI, generateSearchUrl } = require('../helpers/additionalFunctions');

module.exports = async (ctx) => {
  const chatId = ctx.message.chat.id;
  const db = low(adapter);
  const user = db.get('users').find({id: ctx.from.id}).value();

  let movieName = makeURI(ctx);
  let searchUrl = generateSearchUrl('movie', movieName, lang=user.lang);

  ctx.session.state = {};

  let data;

  axios.get(searchUrl).then((res) => {

    if (!res.data) {
      ctx.telegram.sendMessage(chatId, 'No movie found');
    }else {
      data = JSON.parse(JSON.stringify(res.data));

      loadMovieTemplate(ctx, chatId, data);
    }
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
// TODO: парсинг жанров, даты
// TODO: добавить кнопку поиска похожих фильмов к каждому результату
