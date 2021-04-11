const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');

module.exports = async (ctx) => {
  const chatId = ctx.message.chat.id;

  const db = low(adapter);
  const user = db.get('users').find({id: ctx.from.id}).value();

  if (!ctx.state.command.args) {
    ctx.telegram.sendMessage(chatId, 'Please specify the limit of results to display');
  }else {
    console.log(user);
    db.get('users')
    .find({id: ctx.from.id})
    .assign({results_limit: ctx.state.command.args[0]})
    .write()
  }
}
