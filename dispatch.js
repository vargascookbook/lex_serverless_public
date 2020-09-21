'use strict';

const orderCoffee = require('./comprarCerva/comprarCerva');
const greetUser = require('./greetUser');

module.exports = function(intentRequest) {
  console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  const intentName = intentRequest.currentIntent.name;

  console.log(intentName + ' foi chamado');
  if (intentName === 'Pedido') {
    return orderCoffee(intentRequest);
  }

  if (intentName === 'GreetingIntent') {
    return greetUser(intentRequest);
  }

  throw new Error(`Intent with name ${intentName} not supported`);
};
