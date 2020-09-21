'use strict';

const handleDialogCodeHook = require('./manageDialogsCerva');
const handleFulfillmentCodeHook = require('./manageFullfilmentCerva');

module.exports = function(intentRequest) {
  const source = intentRequest.invocationSource;

  if (source === 'DialogCodeHook') {
    return handleDialogCodeHook(intentRequest);
  }

  if (source === 'FulfillmentCodeHook') {
    return handleFulfillmentCodeHook(intentRequest);
  }
};
