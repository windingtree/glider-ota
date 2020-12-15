const {searchOffers} = require('./_lib/glider-api');
const {storeHotelSearchResults, storeFlightSearchResults} = require('./_lib/cache');
const {decorate} = require('./_lib/decorators');
const {validateSearchCriteriaPayload} = require('./_lib/validators');
const {ShoppingCart, CART_USER_PREFERENCES_KEYS} = require('./_lib/shopping-cart');
const {getRateAsync} = require('./_lib/simard-api');


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
    await storeFlightSearchResults(sessionID,offerResult)
  }

  // Convert prices in user preferred currency
  const shoppingCart = new ShoppingCart(sessionID);
  let userCurrency = await shoppingCart.getUserPreference(CART_USER_PREFERENCES_KEYS.CURRENCY);
  let exchangeRates = {};
  for(let i=0; i<Object.keys(offerResult.offers).length; i++) {
    // Retrieve offer details
    let offerId = Object.keys(offerResult.offers)[i];
    let offerPrice = offerResult.offers[offerId].price;

    // If the supplier price is already in the user currency, continue
    if(offerPrice.currency === userCurrency) {
      continue;
    }

    // Retrieve the exchange rate
    let rateKey = `${userCurrency}${offerPrice.currency}`;
    let exchangeRate = exchangeRates[rateKey];
    if(exchangeRate === undefined) {
      let rateResponse = await getRateAsync(userCurrency, offerPrice.currency);
      exchangeRate = Number(rateResponse.rate);
      exchangeRates[rateKey] = exchangeRate;
    }

    // Update offer price and currency
    let convertedPrice = {
      currency: userCurrency,
      public: Number(offerPrice.public * exchangeRate).toFixed(2),
      exchangeRate: exchangeRate,
    }
    offerResult.offers[offerId].price = convertedPrice;

  }

  res.json(offerResult);


}


module.exports = decorate(searchOffersController);

