function loadMovieTemplate(bot, chatId, data) {
  const msg = `${data.title}\n
    Release date: ${data.release_date}\n
    Genre: ${data.genre_ids}\n
    Rate: ${data.vote_average}\n
    Review: ${data.overview}\n
  `;
  bot.telegram.sendMessage(chatId, msg);
}

module.exports = {loadMovieTemplate};
