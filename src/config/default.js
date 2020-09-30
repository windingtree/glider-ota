const config = {
    SEARCH_OFFERS_URL:"/api/searchOffers",
    LOCATION_BOUNDING_BOX_IN_KM:30,
    DEBUG_MODE:true,
    OFFLINE_MODE:false,
    FLIGHTS_PER_PAGE:10,
    CACHE_SIZE_IN_KB:2*1024, //in KB (2024KB = 2MB)
    CACHE_EXPIRY_IN_SECONDS:60*60,    //600 sec = 10 min
    INFURA_ENDPOINT: 'https://ropsten.infura.io/v3/7f4515daf11f4719bc7be70a3b286f46',
    PORTIS_ID: 'cff17cf1-f351-4785-ad04-af9a082499ee',
    DEFAULT_NETWORK: 'ropsten'
};


module.exports = {
  config
};
