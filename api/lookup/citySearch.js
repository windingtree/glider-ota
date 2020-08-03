const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const dictionary = require("../_lib/dictionary-data-cache")
const MAX_RESULTS=30;
const logger = createLogger('/lookup/airportSearch')


/**
 * @module endpoint /lookup/citySearch
 */


/**
 *  /lookup/citySearch endpoint handler
 *  <p/>This endpoint is used to search for locations (cities, places) for hotel search purposes
 *  @async
 */


const lookupCitySearchController = async (req, res) => {
    let searchquery = req.query.searchquery;
    if(!validateRequest(searchquery)){
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid request parameter, searchquery="+searchquery,req.body);
        return;
    }
    try{
        let results = dictionary.findCity(searchquery,MAX_RESULTS)
        res.json({ results: results})
    }catch(error){
        logger.error("Got error while airport search, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
};

function validateRequest(query){
    if(query==undefined || query.length<2)
        return false;
    return true;
}
module.exports = decorate(lookupCitySearchController);
