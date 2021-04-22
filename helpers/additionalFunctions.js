function makeURI(arr) {
  return encodeURI(arr.state.command.args);
}

function generateSearchUrl(type, name, lang = 'en', token = process.env.SEARCH_TOKEN) {
  return `https://api.themoviedb.org/3/search/${type}?api_key=${token}&query=${name}&language=${lang}`;
}

function generateDetailSearchUrl(type, id, lang = 'en', token = process.env.SEARCH_TOKEN) {
  return `https://api.themoviedb.org/3/${type}/${id}?api_key=${token}&language=${lang}`;
}

function generatePosterUrl(width, path) {
  return `https://image.tmdb.org/t/p/w${width}${path}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cinemaNavigation(ctx, chatId, msg, data) {
  let currentResult = ctx.session.state.resultNum + 1;

  ctx.telegram.sendMessage(chatId, msg, {
    parse_mode: 'Markdown',
    disable_web_page_preview: false,
    reply_markup: {
      inline_keyboard: [
        [{text: `Results: ${currentResult} of ${ctx.session.state.data.results.length}`, callback_data: 'results'}],
        [{text: 'Previous', callback_data: 'prev'}, {text: 'Next', callback_data: 'next'}],
        [{text: 'Back', callback_data: 'back'}]
      ]
    }
  }).then((res) => {
    ctx.session.state.lastMessageId = res.message_id;
  });
}
// {text: 'More', callback_data: 'more'}
module.exports = { makeURI, generateSearchUrl, cinemaNavigation, generatePosterUrl, generateDetailSearchUrl, capitalize };
