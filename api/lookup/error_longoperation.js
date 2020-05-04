const {decorate} = require('../_lib/decorators');
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const controller = async (req, res) => {
   await stall(500000); // stalls for 1/2 a second
   res.json({result:'OK'})
};

async function stall(stallTime = 3000) {
   await new Promise(resolve => setTimeout(resolve, stallTime));
}
module.exports = decorate(controller);