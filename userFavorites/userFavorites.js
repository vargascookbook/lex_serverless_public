'use strict';

const databaseManager = require('../databaseManager');

module.exports = function(userId, ListaBrejas, cervejaTamanho) {
  console.log(userId + ' ' + ListaBrejas + ' ' + cervejaTamanho);

  databaseManager.saveUserToDatabase(userId, ListaBrejas, cervejaTamanho).then(item => {
    console.log(item);
  });
};
