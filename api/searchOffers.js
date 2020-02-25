const {searchOffers} = require('./_utils/flights');
const {responseHeaders} = require('../config');
module.exports = (req, response) => {

  searchOffers(req.body,(data)=>{
    //add common headers
    for (let header of Object.keys(responseHeaders)) {
      response.setHeader(header, responseHeaders[header]);
    }
    response.json(data);
  })
};
