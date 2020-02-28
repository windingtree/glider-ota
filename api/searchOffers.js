const {searchOffers} = require('./_utils/flights');

module.exports = (req, response) => {
  searchOffers(req.body,response);
};

