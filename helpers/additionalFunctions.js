function makeURI(arr) {
  return encodeURI(arr.state.command.args);
}

function generateSearchUrl(type, name, lang = 'en', token = process.env.SEARCH_TOKEN) {
  return `https://api.themoviedb.org/3/search/${type}?api_key=${token}&query=${name}&language=${lang}`;
}

module.exports = {makeURI, generateSearchUrl};
