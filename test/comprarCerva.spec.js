const assert = require('chai').assert;

const comprarCerva = require('../comprarCerva/comprarCerva');

describe('DialogCodeHook witn no slots', () => {
  it('Inital message - Eu quero comprar cerveja', done => {
    const intentRequest = {
      messageVersion: '1.0',
      invocationSource: 'DialogCodeHook',
      userId: 'faav875icgkzqzocqbluv1v2r4vf0l20',
      sessionAttributes: null,
      bot: { name: 'ComprarCerva', alias: null, version: '$LATEST' },
      outputDialogMode: 'Text',
      currentIntent: {
        name: 'Pedido',
        slots: { cervejaTamanho: null, ListaBrejas: null },
        confirmationStatus: 'None'
      },
      inputTranscript: 'Eu gostaria de uma cerveja'
    };

    const expectedResponse = {
      sessionAttributes: null,
      dialogAction: { type: 'Delegate', slots: { cervejaTamanho: null, ListaBrejas: null } }
    };

    orderCoffee(intentRequest).then(response => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe('DialogCodeHook with drink slot', () => {
  it('Inital message - Eu gostaria de fazer um pedido', done => {
    const intentRequest = {
      messageVersion: '1.0',
      invocationSource: 'DialogCodeHook',
      userId: 'faav875icgkzqzocqbluv1v2r4vf0l20',
      sessionAttributes: null,
      bot: { name: 'ComprarCerva', alias: null, version: '$LATEST' },
      outputDialogMode: 'Text',
      currentIntent: {
        name: 'Pedido',
        slots: { cervejaTamanho: null, ListaBrejas: 'IPA' },
        confirmationStatus: 'None'
      },
      inputTranscript: 'Eu gostaria de pedir uma IPA'
    };

    const expectedResponse = {
      sessionAttributes: null,
      dialogAction: { type: 'Delegate', slots: { cervejaTamanho: '300ml', ListaBrejas: 'IPA' } }
    };

    orderCoffee(intentRequest).then(response => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe('DialogCodeHook with drink slot - known user', () => {
  it('Inital message - Eu gostaria de comprar uma cerveja', done => {
    const intentRequest = {
      messageVersion: '1.0',
      invocationSource: 'DialogCodeHook',
      userId: 'wetcu9ufuyanvsevpopwonf33c04ex0z',
      sessionAttributes: null,
      bot: { name: 'ComprarCerva', alias: null, version: '$LATEST' },
      outputDialogMode: 'Text',
      currentIntent: {
        name: 'Pedido',
        slots: { cervejaTamanho: null, ListaBrejas: null },
        confirmationStatus: 'None'
      },
      inputTranscript: 'i will like to order a drink'
    };

    const expectedResponse = {
      sessionAttributes: null,
      dialogAction: {
        type: 'ConfirmIntent',
        intentName: 'ComprarCerva',
        slots: { cervejaTamanho: '300ml', ListaBrejas: 'IPA' },
        message: {
          contentType: 'PlainText',
          content: 'Voce gostaria de comprar uma IPA 300ml?'
        }
      }
    };

    orderCoffee(intentRequest).then(response => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe('DialogCodeHook with 2 valid slot', () => {
  it('IPA + 300ml', done => {
    const intentRequest = {
      messageVersion: '1.0',
      invocationSource: 'DialogCodeHook',
      userId: 'zn5e6pwc06gfk08i8e9dvi1i5t0hfxyr',
      sessionAttributes: null,
      bot: { name: 'ComprarCerva', alias: null, version: '$LATEST' },
      outputDialogMode: 'Text',
      currentIntent: {
        name: 'Pedido',
        slots: { cervejaTamanho: '300ml', ListaBrejas: 'IPA' },
        confirmationStatus: 'Confirmed'
      },
      inputTranscript: 'yes'
    };

    const expectedResponse = {
      sessionAttributes: null,
      dialogAction: { type: 'Delegate', slots: { cervejaTamanho: 'normal', ListaBrejas: 'latte' } }
    };

    orderCoffee(intentRequest).then(response => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe('DialogCodeHook with 2 invalid slot', () => {
  it('IPA Grandee', done => {
    const intentRequest = {
      messageVersion: '1.0',
      invocationSource: 'DialogCodeHook',
      userId: 'zn5e6pwc06gfk08i8e9dvi1i5t0hfxyr',
      sessionAttributes: null,
      bot: { name: 'ComprarCerva', alias: null, version: '$LATEST' },
      outputDialogMode: 'Text',
      currentIntent: {
        name: 'Pedido',
        slots: { cervejaTamanho: 'double', ListaBrejas: 'latte' },
        confirmationStatus: 'None'
      },
      inputTranscript: 'eu gostaria de uma IPA grande'
    };

    const expectedResponse = {
      sessionAttributes: null,
      dialogAction: {
        type: 'ElicitSlot',
        intentName: 'Pedido',
        slots: { cervejaTamanho: null, ListaBrejas: 'latte' },
        slotToElicit: 'cervejaTamanho',
        message: {
          contentType: 'PlainText',
          content: 'Nós não temos deste tamanho. 300ml, 500ml e 1L estão disponíveis para este ítem.'
        }
      }
    };

    orderCoffee(intentRequest).then(response => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe('FulfillmentCodeHook with 2 valid slot', () => {
  it('IPA + 500ml', done => {
    const intentRequest = {
      messageVersion: '1.0',
      invocationSource: 'FulfillmentCodeHook',
      userId: 'javddgb05spb4iu06nsu29jax6lphg9n',
      sessionAttributes: null,
      bot: { name: 'ComprarCerva', alias: null, version: '$LATEST' },
      outputDialogMode: 'Text',
      currentIntent: {
        name: 'Pedido',
        slots: { cervejaTamanho: 'normal', ListaBrejas: 'latte' },
        confirmationStatus: 'Confirmed'
      },
      inputTranscript: 'yes'
    };

    orderCoffee(intentRequest).then(response => {
      assert.equal(response.dialogAction.type, 'Close');
      assert.equal(response.dialogAction.fulfillmentState, 'Fulfilled');
      done();
    });
  });
});
