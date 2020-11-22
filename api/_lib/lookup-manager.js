const mongoose = require('mongoose');
const {MONGO_CONFIG} = require('./config');
const {createLogger} = require('./logger');
const logger = createLogger('dao');
const SEARCH_CONFIG = {
    BY_CITY_NAME: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 10
    },
    BY_AIRPORT_NAME: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 20
    },
    BY_AIRPORT_CODE: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 30               //highest weight, match with airport code is more relevant than city or airport name
    }
}

const LOOKUP_CONFIG = {
    MIN_QUERY_LENGTH: 3,
    MAX_RESULTS: 20
}


console.log(`Using DB:${MONGO_CONFIG.URL}`);

mongoose.connect(MONGO_CONFIG.URL, {useNewUrlParser: true, useUnifiedTopology: true});


const Airports = mongoose.model('airports', mongoose.Schema({
    city_name: String,
    city_code: String,
    country_code: String,
    airport_name: String,
    airport_iata_code: String,
    type: String,
    country_name: String,
    timezone: String
}), 'airports');


const isQueryLongerOrEqualThan = (query, length) => {
    if (!query)
        return false;
    return query.length >= length;
}
const decorateRecordWithWeight = (records, weight) => {
    if (!records)
        return [];
    records = records.map(record => {
        record.weight = weight;
        return record;
    })
    return records;
}
/**
 * Wrapper on airports query
 * @param query
 * @returns {Promise<*>}
 */
const searchAirports = async (query, orderBy) => {
    let q = Airports.find(query)
    if (orderBy)
        q = q.sort(orderBy)
    let results = await q.exec();
    return results;
}

/*const searchByExactAirportCode = async (airportCode)=>{
    let results = await searchAirports({airport_iata_code:airportCode});
}*/

const searchByExactAirportCode = async (airportCode) => {
    if (!isQueryLongerOrEqualThan(airportCode, SEARCH_CONFIG.BY_AIRPORT_CODE.MIN_QUERY_LENGTH))
        return [];
    console.log(`searchByExactAirportCode(${airportCode})`);
    let results = await searchAirports({'airport_iata_code': {'$regex': `^${airportCode}`, '$options': 'i'}});
    // let results = await searchAirports({airport_iata_code: airportCode});
    return decorateRecordWithWeight(results, SEARCH_CONFIG.BY_AIRPORT_NAME.WEIGHT);
}
const searchByCityName = async (cityName) => {
    if (!isQueryLongerOrEqualThan(cityName, SEARCH_CONFIG.BY_CITY_NAME.MIN_QUERY_LENGTH))
        return [];
    console.log(`searchByCityName(${cityName})`);
    let results = await searchAirports({'city_name': {'$regex': `^${cityName}`, '$options': 'i'}});
    return decorateRecordWithWeight(results, SEARCH_CONFIG.BY_CITY_NAME.WEIGHT);
}

const searchByAirportName = async (airportName) => {
    if (!isQueryLongerOrEqualThan(airportName, SEARCH_CONFIG.BY_AIRPORT_NAME.MIN_QUERY_LENGTH))
        return [];
    console.log(`searchByAirportName(${airportName})`);
    let results = await searchAirports({'airport_name': {'$regex': `^${airportName}`, '$options': 'i'}});
    return decorateRecordWithWeight(results, SEARCH_CONFIG.BY_AIRPORT_NAME.WEIGHT);
}

const sortResults = (results) => {
    const comparator = (A, B) => {
        let weightA = A.weight || 0;
        let weightB = B.weight || 0;
        if (weightA !== weightB)
            return weightB - weightA;
        let nameA = A.airport_name || '';
        let nameB = B.airport_name || '';
        return nameA.localeCompare(nameB)
    }
    return results.sort(comparator);
}

const findAllAirportsOfCity = async (cityCode) => {
    let results = await searchAirports({'city_code': cityCode});
    return results;
}


// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Newark Liberty Intl", "airport_iata_code" : "EWR", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Stewart International", "airport_iata_code" : "SWF", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "LaGuardia", "airport_iata_code" : "LGA", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "John F Kennedy Intl", "airport_iata_code" : "JFK", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Metropolitan Area", "airport_iata_code" : "NYC", "type" : "METROPOLITAN", "country_name" : "United States" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Skyports SPB", "airport_iata_code" : "NYS", "type" : "AIRPORT", "country_name" : "United States" }


const airportLookup = async (name) => {
    if (!isQueryLongerOrEqualThan(name, LOOKUP_CONFIG.MIN_QUERY_LENGTH)) {
        return [];
    }

    const promises = [
        searchByExactAirportCode(name),
        searchByAirportName(name),
        searchByCityName(name)];
    const results = await Promise.all(promises);
    let records = [];
    results.forEach(airports => {
        airports.forEach(airport => {
            records.push(airport)
        })
    })
    records = sortResults(records);
    const MAX_LEN = 8;
    if (records.length > MAX_LEN) {
        records = records.splice(0, MAX_LEN)
    }
    const finalResults = [];
    const airportCodesFound = {};


    //check if we have metro area - if so, find airports that belong to that city
    for (let airport of records) {

        let iataCode = airport.airport_iata_code;
        if (!iataCode in airportCodesFound) {
            //code was not yet earlier - add that to results
            airportCodesFound[iataCode] = 1;
            finalResults.push(airport);

            if (airport.type === 'METROPOLITAN') {
                let airports = await findAllAirportsOfCity(airport.city_code);
                airports = sortResults(airports)
                finalResults.push(...airports)
                airports.forEach(rec => {
                    airportCodesFound[rec.airport_iata_code] = 1;
                })
            }
        }

    }

    return records;
}

module.exports = {
    searchByExactAirportCode, searchAirports, searchByCityName, searchByAirportName, airportLookup
}


