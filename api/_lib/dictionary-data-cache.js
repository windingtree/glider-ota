const fs = require("fs");
const _ = require('lodash');
const {
    insertMany,
    findAll
} = require('../_lib/mongo-dao');

const DB_LOCATION="api/_data/";
const TABLES={
    AIRLINES:'airlines',
    AIRPORTS:'airports',
    CITIES:'cities',
    CURRENCIES:'currencies',
    COUNTRIES:'COUNTRIES'
}

const CACHE={

};

const DEFAULT_MAX_LOOKUP_RESULTS=30;

/**
 * Retrieve entire table from cache (lazy load it if it wasn't loaded before)
 * @param tableName Table name (case sensitive)
 * @returns {*}
 */

function getTable(tableName){
    ensureTablesIsLoaded(tableName);
    return CACHE[tableName];
}


/**
 * Retrieve key from table from cache (lazy load table if it wasn't loaded before)
 * @param tableName Table name (case sensitive)
 * @param key Key name (case sensitive)
 * @returns {*}
 */

function getTableRecordByKey(tableName, key){
    let table = getTable(tableName);
    return table[key];
}

/**
 * Find a record in a table
 * @param tableName Table to search (case sensitive)
 * @param searchQuery What to search for (case insensitive)
 * @param searchFieldNames Which fields should be searched. If multiple keys need to be searched, this argument can be an array containing field names
 * @param maxResults Max number of results to be returned (optional)
 * @returns {*} Array with matching records
 */

function findTableRecords(tableName, searchQuery, searchFieldNames, maxResults = DEFAULT_MAX_LOOKUP_RESULTS){
    let table = getTable(tableName);
    let result = [];
    let fieldNames=[];
    if(_isArrayType(searchFieldNames))
        fieldNames=searchFieldNames;
    else
        fieldNames.push(searchFieldNames);

     _.each(table,rec=>{
        let valuesToSearch = _getFieldValues(rec,fieldNames);
        if (result.length<maxResults && _match(searchQuery,valuesToSearch)){
            result.push(rec);
        }
    });
    return result;
}

function _match(searchQuery, values){
    let query = searchQuery!==undefined?searchQuery:'';
    query = query.trim();
    let valuesConcat = [];
    query=query.toUpperCase();
    for(let i=0;i<values.length;i++){
        let fieldValue = values[i]!==undefined?values[i]:'';
        fieldValue=fieldValue.toUpperCase();
        valuesConcat.push(fieldValue);
    }
    let concatendatedValues = valuesConcat.join(' ');
    if(concatendatedValues.search(query)>-1)
        return true;
    return false;
}
function _getFieldValues(obj,keys){
    let values=[];
    for(let i=0;i<keys.length;i++){
        if(keys[i] in obj){
            values.push(obj[keys[i]]);
        }
    }
    return values;
}
function _isArrayType(param){
    return "[object Array]"===Object.prototype.toString.call(param);
}

function ensureTablesIsLoaded(tableName){
    if (CACHE[tableName] !== undefined) {
        return;
    }
    CACHE[tableName] = loadTableIntoCache(tableName);
}

/**
 * Lazy load of dictionary data into memory
 * @param tableName Type of data to be loaded
 * @returns {any}
 */
function loadTableIntoCache(tableName) {
    let data;
    switch(tableName){
        case TABLES.AIRLINES:
            data = loadAirlines();
            break;
        case TABLES.AIRPORTS:
            data = loadAirports();
            break;
        case TABLES.CURRENCIES:
            data = loadCurrencies();
            break;
        case TABLES.CITIES:
            data = loadCities();
            break;
        case TABLES.COUNTRIES:
            data = loadCountries();
            break;
        default:
            throw new Error("Unknown table type:"+tableName+", cannot be loaded")
    }
    return data;
}

function loadAirlines(){
    let path = `${DB_LOCATION}${TABLES.AIRLINES}.json`;
    let data = JSON.parse(fs.readFileSync(path));
    let airlineMap = {};
    _.each(data,rec=>{
        airlineMap[rec.airline_iata_code]=rec;
    })
    return airlineMap;
}
function loadAirports(){
    let path = `${DB_LOCATION}${TABLES.AIRPORTS}.json`;
    let data = JSON.parse(fs.readFileSync(path));
    let airportsMap = {};
    _.each(data,rec=>{
        airportsMap[rec.airport_iata_code]=rec;
    })
    return airportsMap;
}

function loadCurrencies(){
    let path = `${DB_LOCATION}${TABLES.CURRENCIES}.json`;
    let data = JSON.parse(fs.readFileSync(path));
    let currenciesMap = {};
    _.each(data,rec=>{
        currenciesMap[rec.currency_code]=rec;
    })
    return currenciesMap;
}

function loadCities(){
    let path = `${DB_LOCATION}${TABLES.CITIES}.json`;
    let data = JSON.parse(fs.readFileSync(path));
    return data;
}

function loadCountries(){
    let path = `${DB_LOCATION}${TABLES.COUNTRIES}.json`;
    let data = JSON.parse(fs.readFileSync(path));
    let countriesMap = {};
    _.each(data,rec=>{
        countriesMap[rec.country_code]=rec;
    })
    return countriesMap;
}

/**
 * Get currency by currency code
 * @param currencyCode Currency code (case sensitive)
 * @returns {*}
 */
function getCurrencyByCode(currencyCode){
    return getTableRecordByKey(TABLES.CURRENCIES,currencyCode.toUpperCase());
}

/**
 * Get country by country code
 * @param currencyCode Country code (case sensitive)
 * @returns {*}
 */
function getCountryByCountryCode(countryCode){
    return getTableRecordByKey(TABLES.COUNTRIES,countryCode.toUpperCase());
}

/**
 * Get airport by iata code
 * @param airportIataCode Airport code (case sensitive)
 * @returns {*}
 */
function getAirportByIataCode(airportIataCode){
    return getTableRecordByKey(TABLES.AIRPORTS,airportIataCode.toUpperCase());
}

/**
 * Get airline by iata code
 * @param airline_iata_code Airport code (case sensitive)
 * @returns {*}
 */
function getAirlineByIataCode(airline_iata_code){
    return getTableRecordByKey(TABLES.AIRLINES,airline_iata_code.toUpperCase());
}

/**
 * Search for airport by iata code/city code/city name
 * @param query Airport code (case insensitive)
 * @returns {*}
 */
function findAirport(query,maxResults = DEFAULT_MAX_LOOKUP_RESULTS){
    return findTableRecords(TABLES.AIRPORTS,query,["airport_iata_code","city_code","city_name","airport_name"], maxResults);
}

/**
 * Find city
 * @param query Airport code (case insensitive)
 * @returns {*}
 */
async function findCity(query, countryCode, maxResults = DEFAULT_MAX_LOOKUP_RESULTS){

    // const table = getTable(TABLES.CITIES);
    // await insertMany(TABLES.CITIES, table)
    //     .then(console.log)
    //     .catch(console.error);

    return findAll(TABLES.CITIES,
        {
            ...(
                query
                    ? {
                        'city_name': {
                            '$regex': `^${query.substr(0, 4)}`,
                            '$options': 'i'
                        }
                    }
                    : {}
            ),
            ...(
                countryCode
                    ? {
                        'country_code': countryCode
                    }
                    : {}
            )
        },
        {
            projection: {
                _id: 0
            },
            limit: maxResults
        }
    );
}



module.exports = {
    findTableRecords,getTableRecordByKey,TABLES, getCurrencyByCode,getAirportByIataCode,getCountryByCountryCode,findAirport,findCity, getAirlineByIataCode
}


