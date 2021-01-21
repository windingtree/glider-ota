const mongoose = require('mongoose');
const {MONGO_CONFIG} = require('./config');
const AIRPORT_SEARCH_CONFIG = {
    BY_CITY_NAME: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 10
    },
    BY_AIRPORT_NAME: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 20
    },
    BY_CITY_CODE: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 25
    },
    BY_AIRPORT_CODE: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 30               //highest weight, match with airport code is more relevant than city or airport name
    }
}

const CITY_SEARCH_CONFIG = {
    BY_CITY_NAME: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 30
    },
    BY_ASCII_NAME: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 20
    },
    BY_ALTERNATE_NAMES: {
        MIN_QUERY_LENGTH: 3,
        WEIGHT: 10
    }
}
const LOOKUP_CONFIG = {
    MIN_QUERY_LENGTH: 3,
    MAX_RESULTS: 30
}


mongoose.connect(MONGO_CONFIG.URL, {useNewUrlParser: true, useUnifiedTopology: true});

//Table which stores airports (needed to populate airport lookup field)
const Airports = mongoose.model('airports', mongoose.Schema({
    city_name: String,
    city_code: String,
    country_code: String,
    airport_name: String,
    airport_iata_code: String,
    type: String,
    country_name: String,
    timezone: String,
    pagerank: Number,   //how popular given airport is
    belongs_to_metropolitan:{type: Boolean, default: false}
}), 'airportscurated');

//SAMPLE AIRPORT RECORDS
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Newark Liberty Intl", "airport_iata_code" : "EWR", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Stewart International", "airport_iata_code" : "SWF", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }

//Table which stores cities (needed to populate cities lookup field in hotel search)
const Cities = mongoose.model('cities', mongoose.Schema({
    city_name: String,
    country_code: String,
    country_name: String,
    asciiname: String,
    alternatenames: String,
    latitude: String,
    longitude: String,
    population: Number, //number of people in a given city
}), 'citiescurated');

//SAMPLE RECORD
/* {
    "city_name" : "Luanda","country_code" : "AO","latitude" : "-8.83682","longitude" : "13.23432","population" : 2776168,"asciiname" : "Luanda","country_name" : "Angola",
    "alternatenames" : "LAD,Loanda,Louanda,Louanta,Luand,Luanda,Luandae,Luando,Lwanda,Lúanda,Saint Paul de Loanda,Sao Paolo de Loanda,Sao Paulo da Assuncao de Luanda,Sao Paulo de Loanda,Sao Paulo de Luanda,St Paul de Loanda,São Paolo de Loanda,São Paulo da Assunção de Luanda,São Paulo de Loanda,São Paulo de Luanda,lu'anda,luanda,luo an da,luvanta,luxanda,luyanda,lwanda,ruanda,Λουάντα,Луандæ,Луанда,Լուանդա,לואנדה,לואנדע,لوآندا,لواندا,لونڈا,लुआंडा,लुआण्डा,লুয়ান্ডা,ਲੁਆਂਦਾ,லுவாண்டா,ลูอันดา,ལའུན་ཌ།,ლუანდა,ሏንዳ,ルアンダ,罗安达,루안다",
}*/

/////////////// GENERIC FUNCTIONS ////////////////////
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
const multipleComparators = (comparators) =>{
    const compare=(A,B)=>{
        for(let comparator of comparators){
            let result = comparator(A,B);
            if(result !== 0)
                return result;
        }
        return 0;
    }
    return compare;
}


/////////////// AIRPORT SEARCH HELPERS ////////////////////

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
const printResults = (message, airports) => {
    console.log(message)
    airports.forEach(airport=>{
        console.log(`\t${airport.airport_name} [iata=${airport.airport_iata_code} city=${airport.city_code} type=${airport.type}] [W:${airport.weight}] [W:${airport.weight}] [RANK:${airport.pagerank}]`)
    })
}

const airportSearchByExactAirportCode = async (airportCode) => {
    if (!isQueryLongerOrEqualThan(airportCode, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_CODE.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'airport_iata_code': {'$regex': `^${airportCode}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results = decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_NAME.WEIGHT);
    // printResults(`searchByExactAirportCode(${airportCode})==>${results.length}`, results);
    return results;
}
const airportSearchByCityName = async (cityName) => {
    if (!isQueryLongerOrEqualThan(cityName, AIRPORT_SEARCH_CONFIG.BY_CITY_NAME.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'city_name': {'$regex': `^${cityName}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results = decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_CITY_NAME.WEIGHT);
    // printResults(`searchByCityName(${cityName})==>${results.length}`, results);
    return results;
}
const airportSearchByCityCode = async (cityCode) => {
    if (!isQueryLongerOrEqualThan(cityCode, AIRPORT_SEARCH_CONFIG.BY_CITY_CODE.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'city_code': {'$regex': `^${cityCode}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results =  decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_CITY_CODE.WEIGHT);
    // printResults(`searchByCityCode(${cityCode})==>${results.length}`, results);
    return results;
}

const airportSearchByAirportName = async (airportName) => {
    if (!isQueryLongerOrEqualThan(airportName, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_NAME.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'airport_name': {'$regex': `^${airportName}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results =  decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_NAME.WEIGHT);
    printResults(`searchByAirportName(${airportName})==>${results.length}`, results);
    return results;
}

const byPageRankComparator = (A, B) => {
    let rankA=Number(A.pagerank);
    let rankB=Number(B.pagerank);
    if(isNaN(rankA))
        rankA=0;
    if(isNaN(rankB))
        rankB=0;
    return rankB-rankA;
}

const removeDupeAirports = (airports) => {
    const isSame = (a,b) =>{
        return ((a.airport_iata_code === b.airport_iata_code) && (a.type === b.type));
    }
    let uniques = airports.filter((v,i,a)=>a.findIndex(t=>isSame(t,v))===i)
    return uniques;
}
const findAllAirportsOfCity = async (cityCode) => {
    let results = await searchAirports({type:'AIRPORT',city_code: cityCode}, {pagerank:-1,city_name:1 });
    return results;
}
const getMetropolitanArea = async (cityCode) => {
    let results = await searchAirports({type:'METROPOLITAN',city_code: cityCode});
    if(results && results.length>0)
        return results[0];
    return undefined;
}

/**
 * Main function that will search for an airport using specified search query
 * @param name
 * @returns {Promise<*|[]|*[]>}
 */
const airportLookup = async (name) => {
    if (!isQueryLongerOrEqualThan(name, LOOKUP_CONFIG.MIN_QUERY_LENGTH)) {
        return [];
    }

    //this should be optimized to avoid multiple calls - use one or two queries instead
    const promises = [
        airportSearchByExactAirportCode(name),
        airportSearchByCityCode(name),
        airportSearchByAirportName(name),
        airportSearchByCityName(name)];
    const results = await Promise.all(promises);
    let records = [];
    results.forEach(airports => {
        airports.forEach(airport => {
            records.push(airport)
        })
    })

    records = records.sort(multipleComparators([byPageRankComparator]));

    records = removeDupeAirports(records);
    const MAX_LEN = 5;
    if (records.length > MAX_LEN) {
        records = records.splice(0, MAX_LEN)
    }
    let finalResults = [];

    //check if we have metro area - if so, find airports that belong to that city
    for (let airport of records) {
        let {city_code, airport_name, airport_iata_code, type, belongs_to_metropolitan} = airport
            if (type === 'AIRPORT')
            {
                if(belongs_to_metropolitan) {   //if airport belongs to metro, find metro and all cities that belong to it, add to results
                    let metro = await getMetropolitanArea(city_code);
                    if (metro) {
                        finalResults.push(metro)
                        let airports = await findAllAirportsOfCity(metro.city_code);
                        finalResults.push(...airports)
                    }
                }else {
                    //city does not belong to metro
                    finalResults.push(airport)
                }
            }
            if (type === 'METROPOLITAN') {  //it's metro area - add all cities that belong to it
                finalResults.push(airport)
                let airports = await findAllAirportsOfCity(city_code);
                finalResults.push(...airports)
            }
    }
    finalResults = removeDupeAirports(finalResults);
    return finalResults;
}


/////////////// CITY SEARCH HELPERS ////////////////////

/**
* Wrapper on cities query
* @param query
* @returns {Promise<*>}
*/
const searchCities = async (query, orderBy) => {
    let q = Cities.find(query)
    if (orderBy)
        q = q.sort(orderBy)
    let results = await q.exec();
    return results;
}

const citySearchByCityName = async (cityName) => {
    if (!isQueryLongerOrEqualThan(cityName, CITY_SEARCH_CONFIG.BY_CITY_NAME.MIN_QUERY_LENGTH))
        return [];
    let results = await searchCities({'city_name': {'$regex': `^${cityName}`, '$options': 'i'}},{population:-1,city_name:1 });
    results = decorateRecordWithWeight(results, CITY_SEARCH_CONFIG.BY_CITY_NAME.WEIGHT);
    return results;
}

const citySearchByAsciiName = async (cityName) => {
    if (!isQueryLongerOrEqualThan(cityName, CITY_SEARCH_CONFIG.BY_ASCII_NAME.MIN_QUERY_LENGTH))
        return [];
    let results = await searchCities({'asciiname': {'$regex': `^${cityName}`, '$options': 'i'}},{population:-1,city_name:1 });
    results = decorateRecordWithWeight(results, CITY_SEARCH_CONFIG.BY_CITY_NAME.WEIGHT);
    return results;
}

const byPopulationRankComparator = (A, B) => {
    let rankA=Number(A.population);
    let rankB=Number(B.population);
    if(isNaN(rankA))
        rankA=0;
    if(isNaN(rankB))
        rankB=0;
    return rankB-rankA;
}


const removeDupeCities = (cities) => {
    const isSame = (a,b) =>{
        return ((a.city_name === b.city_name));
    }
    let uniques = cities.filter((v,i,a)=>a.findIndex(t=>isSame(t,v))===i)
    return uniques;
}

const cityLookup = async (name) => {
    if (!isQueryLongerOrEqualThan(name, LOOKUP_CONFIG.MIN_QUERY_LENGTH)) {
        return [];
    }

    //this should be optimized to avoid multiple calls - use one or two queries instead
    const promises = [
        citySearchByCityName(name),
        citySearchByAsciiName(name)];
    const results = await Promise.all(promises);
    let records = [];
    results.forEach(cities => {
        cities.forEach(airport => {
            records.push(airport)
        })
    })

    records = records.sort(multipleComparators([byPopulationRankComparator]));

    records = removeDupeCities(records);
    const MAX_LEN = 5;
    if (records.length > MAX_LEN) {
        records = records.splice(0, MAX_LEN)
    }
    return records;
}



module.exports = {
    searchByExactAirportCode: airportSearchByExactAirportCode, searchAirports, searchByCityName: airportSearchByCityName, searchByAirportName: airportSearchByAirportName, airportLookup,
    cityLookup, citySearchByCityName
}


