'use strict';

const uuidV1 = require('uuid/v1');
const AWS = require('aws-sdk');
const promisify = require('es6-promisify');
const _ = require('lodash');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.saveOrderToDatabase = function(userId, cervaTipo, cervejaTamaho) {
  console.log('saveOrderToDatabase');

  const item = {};
  item.orderId = uuidV1();
  item.cervaTipo = cervaTipo;
  item.cervejaTamanho = cervejaTamaho;
  item.userId = userId;

  return saveItemToTable('ComprarCerva_Pedido', item);
};

module.exports.saveUserToDatabase = function(userId, cervaTipo, cervejaTamaho) {
  console.log('saveUserToDatabase');

  const item = {};
  item.cervaTipo = cervaTipo;
  item.cervejaTamanho = cervejaTamaho;
  item.userId = userId;

  return saveItemToTable('ComprarCerva_User', item);
};

module.exports.findUserFavorite = function(userId) {
  const params = {
    TableName: 'ComprarCerva_User',
    Key: {
      userId
    }
  };

  const getAsync = promisify(dynamo.get, dynamo);

  return getAsync(params).then(response => {
    if (_.isEmpty(response)) {
      console.log(`Usuário com userId:${userId} não encontrado`);
      return Promise.reject(new Error(`Usuário com userId:${userId} não encontrado.`));
    }
    return response.Item;
  });
};

function saveItemToTable(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item
  };

  const putAsync = promisify(dynamo.put, dynamo);

  return putAsync(params)
    .then(() => {
      console.log(`Salvando item ${JSON.stringify(item)}`);
      return item;
    })
    .catch(error => {
      Promise.reject(error);
    });
}
