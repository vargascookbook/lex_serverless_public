'use strict';

const dispatch = require('./dispatch');
const userFavorites = require('./userFavorites/userFavorites');

module.exports.intents = (event, context, callback) => {
  try {
    console.log(`event.bot.name=${event.bot.name}`);
    dispatch(event).then(response => {
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};

module.exports.saveUserFavorites = (event, context, callback) => {
  console.log('saveUserFavorites lambda called');
  console.log(event);

  userFavorites(event.userId.S, event.currentIntent.slots.cervaTipo.S, event.currentIntent.slots.cervejaTamanho.S);
  callback(null, null);
};
