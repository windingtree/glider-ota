const {searchOffers} = require('./_lib/glider-api');
const {createLogger} = require('./_lib/logger')
const {decorate} = require('./_lib/decorators');
// const logger = createLogger('/searchOffers')

const searchOffersController = async (req, res) => {
  let order = await searchOffers(req.body);
  res.json(order);
}


module.exports = decorate(searchOffersController);

