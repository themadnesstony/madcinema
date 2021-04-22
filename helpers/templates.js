const { cinemaNavigation, generatePosterUrl, capitalize } = require('../helpers/additionalFunctions');

// Parse language abbreavation
let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});

function loadMovieTemplate(ctx, chatId, data) {
  // Push results in user session
  if (!ctx.session.state || ctx.session.state !== {}) {
    ctx.session.state = {
      data: data,
      chatId: chatId,
      resultNum: ctx.session.state.resultNum ? ctx.session.state.resultNum : 0,
      lastMessageId: 0
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
  const genres = res.genres ? res.genres.map((genre) => {return capitalize(genre.name)}) : 'No info';
  const language = res.original_language ? languageNames.of(res.original_language) : 'No info';
  const budget = res.budget ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(res.budget) : 'No info';
  const rate = res.vote_average ? res.vote_average : 'No info';
  const overview = res.overview ? res.overview : 'No info';

  let msg = `[${title}](${generatePosterUrl(500, res.poster_path)})\n
*Release date:* ${date}\n
*Genres:* ${genres.join(', ')}\n
*Language:* ${language}\n
*Budget:* ${budget}\n
*Rate:* ${rate}\n
*Overview:* ${overview}\n`;

  // Send results with inline menu
  cinemaNavigation(ctx, chatId, msg, data);
}

function loadTvTemplate(ctx, chatId, data) {
  console.log('template for tv here');
}

module.exports = { loadMovieTemplate, loadTvTemplate };
