const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const dictionary = require("../_lib/dictionary-data-cache")
const MAX_RESULTS=30;
const logger = createLogger('/lookup/airportSearch')
const lookupController = async (req, res) => {
    let searchquery = req.query.searchquery;
    if(!validateRequest(searchquery)){
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid request parameter, searchquery="+searchquery,req.body);
        return;
    }
    try{
        let results = dictionary.findAirport(searchquery,MAX_RESULTS);
        sortByAirportType(results);
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

function sortByAirportType(airports){
    airports.sort(compareAirports);
}

function compareAirports(a,b){
    let cityCompare = strCmp(a.city_name,b.city_name);
    if(cityCompare !== 0)
        return cityCompare;
    let cityCodeCompare = strCmp(a.city_code,b.city_code);
    if(cityCodeCompare !== 0)
        return cityCodeCompare;

    if(a.type !== b.type){
        if(a.type === 'METROPOLITAN') return -1;
        else return 1;
    }

    return strCmp(a.airport_name,b.airport_name);
}
function strCmp(a,b){
    if(a===b)
        return 0;
    if(a<b)
        return -1;
    return 1;
}
module.exports = decorate(lookupController);
