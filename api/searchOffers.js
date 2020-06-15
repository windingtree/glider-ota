const {searchOffers} = require('./_lib/glider-api');
const {createLogger} = require('./_lib/logger')
const {decorate} = require('./_lib/decorators');
// const logger = createLogger('/searchOffers')

const searchOffersController = async (req, res) => {
  // Call glider API to get offers
  let offerResult = await searchOffers(req.body);

  res.json(offerResult);
}


module.exports = decorate(searchOffersController);

