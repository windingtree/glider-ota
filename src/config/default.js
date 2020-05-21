const config = {
    SEARCH_OFFERS_URL:"/api/searchOffers",
    LOCATION_BOUNDING_BOX_IN_KM:10,
    DEBUG_MODE:true,
    OFFLINE_MODE:false,
    FLIGHTS_PER_PAGE:10,
    CACHE_SIZE_IN_KB:2*1024, //in KB (2024KB = 2MB)
    CACHE_EXPIRY_IN_SECONDS:60*60,    //600 sec = 10 min
};


module.exports = {
  config
};