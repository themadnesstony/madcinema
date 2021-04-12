function makeURI(arr) {
  return encodeURI(arr.state.command.args);
}

function generateSearchUrl(type, name, lang = 'en', token = process.env.SEARCH_TOKEN) {
  return `https://api.themoviedb.org/3/search/${type}?api_key=${token}&query=${name}&language=${lang}`;
}

function cinemaNavigation(ctx, chatId, msg, data) {
  let currentResult = ctx.session.state.resultNum + 1;
  ctx.telegram.sendMessage(chatId, msg, {
    reply_markup: {
      inline_keyboard: [
        [{text: `Results: ${currentResult} of 20`, callback_data: 'results'}],
        [{text: 'Previous', callback_data: 'prev'},{text: 'More', callback_data: 'more'}, {text: 'Next', callback_data: 'next'}],
        [{text: 'Back', callback_data: 'back'}]
      ]
    }
  }).then((res) => {
    ctx.session.state.lastMessageId = res.message_id;
  });
}

module.exports = { makeURI, generateSearchUrl, cinemaNavigation };
