#!/bin/env node

// #########################
// Config
// #########################
require('dotenv').config();

const path = require('path');

const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const axios = require('axios');

const {loadMovieTemplate} = require('./helpers/templates');
const {makeURI, generateSearchUrl} = require('./helpers/additionalFunctions');

// #########################
// Init bot
// #########################
const bot = new Telegraf(process.env.BOT_TOKEN);

// #########################
// Movie search API token
// #########################
const searchToken = process.env.SEARCH_TOKEN;

// #########################
// Database
// #########################
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default
db.defaults({ users: [] })
  .write();

// #########################
// Middleware
// #########################
bot.use(commandParts());

// #########################
// Start using bot
// #########################
bot.start((ctx) => {
  ctx.reply(`Welcome, ${ctx.message.chat.username}`);
  db.get('users')
  .push({ id: ctx.from.id, lang: ctx.from.language_code})
  .write()
});

// Select language
bot.command('language', (ctx) => {
  const chatId = ctx.message.chat.id;

  ctx.telegram.sendMessage(chatId, 'Select a language', {
    reply_markup: {
      inline_keyboard: [
        [{text: 'English', callback_data: 'en'}, {text: 'Russian', callback_data: 'ru'}]
      ]
    }
  });

});

bot.action('en', (ctx) => {
  let id = ctx.from.id;
  if (db.get('users').find({id: id}).value()) {
    console.log('User exists');
  }else {
    console.log('User not find');
  }
  ctx.deleteMessage();

});

bot.action('ru', (ctx) => {
  ctx.deleteMessage();
  // state.lang='ru';  console.log(state);
});

// TODO: условие, если нет какого либо из полей - "то выводить данных нет". Если ничего не найдено - соответственно.
// TODO: Если нет на каком то языке - выводить другой
// TODO: settings command - настройка количества выводимых результатов

// Movie search
bot.command('movie', (ctx) => {
  const chatId = ctx.message.chat.id;
  const user = db.get('users').find({id: ctx.from.id}).value();

  let movieName = makeURI(ctx);
  let searchUrl = generateSearchUrl('movie', movieName, lang=user.lang);

  let data;

  axios.get(searchUrl).then((res) => {

    if (!res.data) {
      bot.telegram.sendMessage(chatId, 'No movie found');
    }else {
      data = JSON.parse(JSON.stringify(res.data.results[0]));

      loadMovieTemplate(bot, chatId, data);
    }
  }).catch((err) => {
    console.log(err);
    bot.telegram.sendMessage(chatId, 'No movie found');
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    }
  });

});

bot.catch((err) => {
  console.log(err);
});

bot.command('test', ctx => {
  console.log(ctx.from);
});

bot.launch();

// #########################
// Enable graceful stop
// #########################
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
