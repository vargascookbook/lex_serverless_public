'use strict';

const lexResponses = require('../lexResponses');
const databaseManager = require('../databaseManager');
const _ = require('lodash');

const tipos = ['IPA', 'PILSEN', 'CANTILLON', 'STOUT'];
const tamanhos = ['300ml', '500ml', '1L'];

function buildValidationResult(isValid, violatedSlot, messageContent, options) {
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot,
      options
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent },
    options
  };
}

function buildUserFavoriteResult(ListaBrejas, cervejaTamanho, messageContent) {
  return {
    ListaBrejas,
    cervejaTamanho,
    message: { contentType: 'PlainText', content: messageContent }
  };
}

function getButtons(options) {
  var buttons = [];
  _.forEach(options, option => {
    buttons.push({
      text: option,
      value: option
    });
  });
  return buttons;
}

function getOptions(title, types) {
  return {
    title,
    imageUrl: 'https://thefullpint.com/wp-content/uploads/Cigar-City-New-Cans.jpg',
    buttons: getButtons(types)
  };
}

function validateBeerOrder(cervaTipo, cervejaTamanho) {
  if (cervaTipo && tipos.indexOf(cervaTipo.toLowerCase()) === -1) {
    const options = getOptions('Segue nossos tipos de cervejas disponíveis: ', tipos);
    return buildValidationResult(false, 'cervejaTamanho', `Nós não temos ${cervaTipo}, você gostaria um outro tipo de cerveja?  A nossa mais popular é a IPA.`, options);
  }

  if (cervejaTamanho && tamanhos.indexOf(cervejaTamanho.toLowerCase()) === -1) {
    const options = getOptions('Selecione o tamanho', tamanhos);
    return buildValidationResult(false, 'cervejaTamanho', `Nós nao temos tamanho ${cervejaTamanho}, Você gostaria de um outro tamanho? Nosso mais popular é 500ml.`, options);
  }

  if (cervaTipo && cervejaTamanho) {
    //IPA e PILSEN nos tamanhos 300ml e 500ml
    if ((cervaTipo.toLowerCase() === 'ipa' || cervaTipo.toLowerCase() === 'pilsen') && !(cervejaTamanho.toLowerCase() === '300ml' || cervejaTamanho.toLowerCase() === '500ml')) {
      const options = getOptions('Escolha um tamanho', ['300ml', '500ml']);
      return buildValidationResult(false, 'cervaTipo', `Nós não temos ${cervaTipo} neste tamanho. 300ml e 500ml estão disponíveis para este item.`, options);
    }

    //STOUT so pode ser 500ml ou 1L
    if (cervaTipo.toLowerCase() === 'stout' && !(cervejaTamanho.toLowerCase() === '500ml' || cervejaTamanho.toLowerCase() === '1l')) {
      const options = getOptions('Selecione um tamanho', ['500ml', '1L']);
      return buildValidationResult(false, 'cervaTipo', `Nós não temos ${cervaTipo} neste tamanho. 500ml e 1L estão disponíveis para este item.`, options);
    }

    //Cantillon é sempre 1L
    if (cervaTipo.toLowerCase() === 'cantillon' && cervejaTamanho.toLowerCase() !== '1l') {
      const options = getOptions('Selecione o tamanho', ['1L']);
      return buildValidationResult(false, 'cervaTipo', `Nós não temos ${cervaTipo} neste tamanho. Tamanho 1L está disponível para esta raridade.`, options);
    }
  }

  return buildValidationResult(true, null, null);
}

function findUserFavorite(userId) {
  return databaseManager.findUserFavorite(userId).then(item => {
    return buildUserFavoriteResult(item.ListaBrejas, item.cervejaTamanho, `Você gostaria de pedir a ${item.cervejaTamanho} ${item.ListaBrejas}?`);
  });
}

module.exports = function(intentRequest) {
  var cervaTipo = intentRequest.currentIntent.slots.ListaBrejas;
  var cervejaTamanho = intentRequest.currentIntent.slots.cervejaTamanho;
  var userId = intentRequest.userId;
  const slots = intentRequest.currentIntent.slots;

  if (cervaTipo === null && cervejaTamanho === null) {
    return findUserFavorite(userId)
      .then(item => {
        slots.cervejaTamanho = item.cervejaTamanho;
        slots.ListaBrejas = item.ListaBrejas;
        //Ask the user if he will like to order this item
        return lexResponses.confirmIntent(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, item.message);
      })
      .catch(error => {
        //Precisa perguntar pro usuário qual cerveja ele quer?
        return lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots);
      });
  } else {
    const validationResult = validateBeerOrder(cervaTipo, cervejaTamanho);

    if (!validationResult.isValid) {
      slots[`${validationResult.violatedSlot}`] = null;
      return Promise.resolve(
        lexResponses.elicitSlot(
          intentRequest.sessionAttributes,
          intentRequest.currentIntent.name,
          slots,
          validationResult.violatedSlot,
          validationResult.message,
          validationResult.options.title,
          validationResult.options.imageUrl,
          validationResult.options.buttons
        )
      );
    }

    //If size is not define then set it as normal
    if (cervejaTamanho == null) {
      intentRequest.currentIntent.slots.cervejaTamanho = '300ml';
    }
    return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
  }
};
