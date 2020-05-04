const {decorate} = require('../_lib/decorators');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const controller = async (req, res) => {
   throw new Error("failure")
};


module.exports = decorate(controller);