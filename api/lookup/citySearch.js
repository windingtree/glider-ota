const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const dictionary = require("../_lib/dictionary-data-cache")
const MAX_RESULTS=30;
const logger = createLogger('/lookup/airportSearch')
const lookupController = async (req, res) => {
    const {
        searchquery,
        country_code
    } = req.query;

    if(!validateRequest(req.query)){
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid request parameter, searchquery="+searchquery,req.body);
        return;
    }
    try{
        let results = await dictionary.findCity(searchquery, country_code, MAX_RESULTS);
        res.json({ results })
    }catch(error){
        logger.error("Got error while airport search, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
};

function validateRequest(query){
    if ((query.searchquery && query.searchquery.length > 2) ||
        (query.country_code && query.country_code.length >= 2)) {
        return true;
    }

    return true;
}
module.exports = decorate(lookupController);
