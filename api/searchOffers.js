const {searchOffers} = require('./_lib/glider-api');
const {createLogger} = require('./_lib/logger')
const {decorate} = require('./_lib/decorators');
// const logger = createLogger('/searchOffers')


/**
 * @module endpoint /searchOffers
 */


/**
 * This endpoint is used to search for either flight or hotel offers
 * <br/>It forwards a request to Glider to search for all flights/hotels matching search criteria
 */


const searchOffersController = async (req, res) => {
  // Call glider API to get offers
  let offerResult = await searchOffers(req.body);

  res.json(offerResult);
}


module.exports = decorate(searchOffersController);

