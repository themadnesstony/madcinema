module.exports = async (ctx) => {
  const chatId = ctx.message.chat.id;

  ctx.telegram.sendMessage(chatId, 'Select a language', {
    reply_markup: {
      inline_keyboard: [
        [{text: 'English', callback_data: 'en'}, {text: 'Russian', callback_data: 'ru'}],
        [{text: 'Back', callback_data: 'back'}]
      ]
    }
  });

}
