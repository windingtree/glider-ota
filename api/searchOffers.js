const {searchOffers} = require('./_lib/glider-api');
const {decorate} = require('./_lib/decorators');
const {validateSearchCriteriaPayload} = require('./_lib/validators')
const searchOffersController = async (req, res) => {
  //validate if payload is OK
  validateSearchCriteriaPayload(req.body);


  // Call glider API to get offers
  let offerResult = await searchOffers(req.body);
  // delete offerResult.itineraries
  res.json(offerResult);
}


module.exports = decorate(searchOffersController);

