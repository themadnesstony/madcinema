#!/bin/env node

// #########################
// Config
// #########################
require('dotenv').config();

const path = require('path');

const Telegraf = require('telegraf');
const session = require('telegraf/session');
const commandParts = require('telegraf-command-parts');

const axios = require('axios');

const { loadMovieTemplate } = require('./helpers/templates');

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
bot.use(session());

// #########################
// Import commands
// #########################
const movieSearch = require('./commands/movie');
const languageSelect = require('./commands/language');
const settings = require('./commands/settings');

// #########################
// Start using bot
// #########################
bot.start((ctx) => {
  ctx.reply(`Welcome, ${ctx.message.chat.username}`);
  db.get('users')
  .push({ id: ctx.from.id, lang: ctx.from.language_code ? ctx.from.language_code : 'en', results_limit: 20})
  .write()
});

// #########################
// Commands
// #########################
bot.command('language', languageSelect);
bot.command('movie', movieSearch);
bot.command('settings', settings);


// #########################
// Actions
// #########################

// Select English language
bot.action('en', (ctx) => {
  let id = ctx.from.id;
  let user = db.get('users').find({id: id}).value();

  if (user) {
    db.get('users')
    .find({id: id})
    .assign({lang: 'en'})
    .write()
  }else {
    console.log('User not find');
  }
  ctx.deleteMessage();
});

// Select Russian language
bot.action('ru', (ctx) => {
  let id = ctx.from.id;
  let user = db.get('users').find({id: id}).value();

  if (user) {
    db.get('users')
    .find({id: id})
    .assign({lang: 'ru'})
    .write()
  }else {
    console.log('User not find');
  }
  ctx.deleteMessage();
});

// Back from menu
bot.action('back', (ctx) => {
  ctx.deleteMessage();
  // ctx.session.state = {};
});

// Previous result
bot.action('prev', (ctx) => {
  if (ctx.session.state.resultNum === 0) {
    return;
  }else {
    ctx.deleteMessage();
    ctx.session.state.resultNum--;
    loadMovieTemplate(ctx, ctx.session.state.chatId, ctx.session.state.data);
  }
});

// More info about cinema
bot.action('more', (ctx) => {
  console.log('More info about cinema here');
});

// Next result
bot.action('next', (ctx) => {
  if (ctx.session.state.resultNum + 1 === ctx.session.state.data.total_results) {
    return;
  }else {
    ctx.deleteMessage();
    ctx.session.state.resultNum++;
    loadMovieTemplate(ctx, ctx.session.state.chatId, ctx.session.state.data);
  }
});

// #########################
// Error handling
// #########################
bot.catch((err) => {
  console.log(err);
});

// #########################
// Launch
// #########################
bot.launch();

// #########################
// Enable graceful stop
// #########################
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
