const {searchOffers} = require('./_utils/aggregator-api');

module.exports = (req, response) => {
  searchOffers(req.body,response);
};

