#!/bin/env node

// #########################
// Config
// #########################
require('dotenv').config();

const path = require('path');

const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const axios = require('axios');

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
// Import commands
// #########################
const movieSearch = require('./commands/movie');
const languageSelect = require('./commands/language');

// #########################
// Start using bot
// #########################
bot.start((ctx) => {
  ctx.reply(`Welcome, ${ctx.message.chat.username}`);
  db.get('users')
  .push({ id: ctx.from.id, lang: ctx.from.language_code ? ctx.from.language_code : 'en'})
  .write()
});

// #########################
// Commands
// #########################
bot.command('language', languageSelect);
bot.command('movie', movieSearch);


// #########################
// Actions
// #########################
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

// TODO: условие, если нет какого либо из полей - "то выводить данных нет". Если ничего не найдено - соответственно.
// TODO: Если нет на каком то языке - выводить другой
// TODO: settings command - настройка количества выводимых результатов


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
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
