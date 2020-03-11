const {createWithOffer} = require('./_utils/aggregator-api');

module.exports = (req, response) => {
  createWithOffer(req.body,response);
};

