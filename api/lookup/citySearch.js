const {decorate} = require('../_lib/decorators');
const {createLogger} = require('../_lib/logger')
const {sendErrorResponse,ERRORS} = require("../_lib/rest-utils")
const lookup = require("../_lib/lookup-manager");
const logger = createLogger('/lookup/citySearch')
const lookupController = async (req, res) => {
    let searchquery = req.query.searchquery;
    let country_code = req.query.country_code;
    const start = process.hrtime();
    if(!validateRequest(searchquery)){
        sendErrorResponse(res,400,ERRORS.INVALID_INPUT,"Invalid request parameter, searchquery="+searchquery,req.body);
        return;
    }
    try{
        let results = await lookup.cityLookup(searchquery);

        //if country_code parameter is specified, narrow down results to cities that belong to specified country
        if(country_code){
            results = results.filter(city=>city.country_code.toUpperCase() === country_code.toUpperCase())
        }

        res.json({
            results
        });
    }catch(error){
        logger.error("Got error while airport search, error:%s",error.message,error)
        sendErrorResponse(res,500,ERRORS.INTERNAL_SERVER_ERROR);
    }
    console.log('Lookup time:', process.hrtime(start))
};

function validateRequest(query){
    return !(query === undefined || query.length < 2);

}
module.exports = decorate(lookupController);
