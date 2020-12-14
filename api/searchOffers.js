const {searchOffers} = require('./_lib/glider-api');
const {storeHotelSearchResults, storeFlightSearchResults} = require('./_lib/cache');
const {decorate} = require('./_lib/decorators');
const {validateSearchCriteriaPayload} = require('./_lib/validators')
const searchOffersController = async (req, res) => {
  const criteria = req.body
  let sessionID = req.sessionID;
  //validate if payload is OK
  validateSearchCriteriaPayload(req.body);
  // Call glider API to get offers
  let offerResult = await searchOffers(req.body);
  // delete offerResult.itineraries

  //store results in redis (for cache purpose)
  if(criteria.accommodation){
    await storeHotelSearchResults(sessionID, offerResult)
  }
  if(criteria.itinerary){
    await storeFlightSearchResults(sessionID, Object.assign(offerResult,{source:'storeFlightSearchResults'}))
  }


  res.json(offerResult);


}


module.exports = decorate(searchOffersController);

