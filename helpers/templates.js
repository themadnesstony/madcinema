const { cinemaNavigation } = require('../helpers/additionalFunctions');

function loadMovieTemplate(ctx, chatId, data) {
  // Push results in user session
  if (!ctx.session.state) {
    ctx.session.state = {
      data: data,
      chatId: chatId,
      resultNum: 0
    }
  }

  ctx.session.state.currentResult = ctx.session.state.data.results[ctx.session.state.resultNum];

  let res = ctx.session.state.currentResult;

  let title;
  if (res.title) {
    title = res.title;
  }else {
    title = res.original_title;
  }
  const date = res.release_date ? res.release_date.split('-').reverse().join('.') : 'No info';
  const genres = '';
  const language = res.original_language ? res.original_language : 'No info';
  const rate = res.vote_average ? res.vote_average : 'No info';
  const overview = res.overview ? res.overview : 'No info';


  const msg = `${title}\n
    Release date: ${date}\n
    Genre: ${res.genre_ids}\n
    Original language: ${language}\n
    Rate: ${rate}\n
    Overview: ${overview}\n`;

  // Send results with inline menu
  cinemaNavigation(ctx, chatId, msg, data);
}

function loadTvTemplate(ctx, chatId, data) {
  console.log('template for tv here');
}

module.exports = { loadMovieTemplate, loadTvTemplate };
// TODO: условие, если нет какого либо из полей - "то выводить данных нет". Если ничего не найдено - соответственно.
// TODO: Если нет на каком то языке - выводить другой
