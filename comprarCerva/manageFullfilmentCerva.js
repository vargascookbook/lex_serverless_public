'use strict';

const lexResponses = require('../lexResponses');
const databaseManager = require('../databaseManager');

function buildFulfilmentResult(fullfilmentState, messageContent) {
  return {
    fullfilmentState,
    message: { contentType: 'PlainText', content: messageContent }
  };
}

function fullfilOrder(userId, cervaTipo, cervejaTamanho) {
  return databaseManager.saveOrderToDatabase(userId, cervaTipo, cervejaTamanho).then(item => {
    return buildFulfilmentResult('Fulfilled', `Obrigado. Seu pedido ${item.orderId} foi recebido e em breve entraremos em contato por e-mail confirmado seu pagamento e entrega. Obrigado! CervaBot.`);
  });
}

module.exports = function(intentRequest) {
  var cervaTipo = intentRequest.currentIntent.slots.ListaBrejas;
  var cervejaTamanho = intentRequest.currentIntent.slots.cervejaTamanho;
  var userId = intentRequest.userId;

  return fullfilOrder(userId, cervaTipo, cervejaTamanho).then(fullfiledOrder => {
    return lexResponses.close(intentRequest.sessionAttributes, fullfiledOrder.fullfilmentState, fullfiledOrder.message);
  });
};
