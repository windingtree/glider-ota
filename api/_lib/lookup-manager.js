const {getModel:getAirportsModel} = require('./models/airports')
const {getModel:getCitiesModel} = require('./models/cities')

//default configuration for airport search behaviour
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

//default configuration for cities search behaviour
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
    MIN_QUERY_LENGTH: 3,        //min query length to trigger search in mongo (shorter queries will be ignored)
    MAX_RESULTS: 30
}


//SAMPLE AIRPORT RECORDS
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Newark Liberty Intl", "airport_iata_code" : "EWR", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }
// { "city_name" : "New York", "city_code" : "NYC", "country_code" : "US", "airport_name" : "Stewart International", "airport_iata_code" : "SWF", "type" : "AIRPORT", "country_name" : "United States", "timezone" : "America/New_York" }


//SAMPLE RECORD
// { "city_name" : "Luanda","country_code" : "AO","latitude" : "-8.83682","longitude" : "13.23432","population" : 2776168,"asciiname" : "Luanda","country_name" : "Angola", "alternatenames" : "LAD,Loanda,Louanda,Louanta,Luand,Luanda,Luandae,Luando,Lwanda,Lúanda,Saint Paul de Loanda,Sao Paolo de Loanda,Sao Paulo da Assuncao de Luanda,Sao Paulo de Loanda,Sao Paulo de Luanda,St Paul de Loanda,São Paolo de Loanda,São Paulo da Assunção de Luanda,São Paulo de Loanda,São Paulo de Luanda,lu'anda,luanda,luo an da,luvanta,luxanda,luyanda,lwanda,ruanda,Λουάντα,Луандæ,Луанда,Լուանդա,לואנדה,לואנדע,لوآندا,لواندا,لونڈا,लुआंडा,लुआण्डा,লুয়ান্ডা,ਲੁਆਂਦਾ,லுவாண்டா,ลูอันดา,ལའུན་ཌ།,ლუანდა,ሏንዳ,ルアンダ,罗安达,루안다", }

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
    return (A, B) => {
        for (let comparator of comparators) {
            let result = comparator(A, B);
            if (result !== 0)
                return result;
        }
        return 0;
    };
}


/////////////// AIRPORT SEARCH HELPERS ////////////////////

/**
 * Wrapper on airports query
 * @param query
 * @param orderBy
 * @returns {Promise<*>}
 */
const searchAirports = async (query, orderBy) => {
    const AirportsModel = await getAirportsModel();
    let q = AirportsModel.find(query)
    if (orderBy)
        q = q.sort(orderBy)
    return await q.exec();
}

const airportSearchByExactAirportCode = async (airportCode) => {
    if (!isQueryLongerOrEqualThan(airportCode, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_CODE.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'airport_iata_code': {'$regex': `^${airportCode}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results = decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_NAME.WEIGHT);
    return results;
}
const airportSearchByCityName = async (cityName) => {
    if (!isQueryLongerOrEqualThan(cityName, AIRPORT_SEARCH_CONFIG.BY_CITY_NAME.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'city_name': {'$regex': `^${cityName}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results = decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_CITY_NAME.WEIGHT);
    return results;
}
const airportSearchByCityCode = async (cityCode) => {
    if (!isQueryLongerOrEqualThan(cityCode, AIRPORT_SEARCH_CONFIG.BY_CITY_CODE.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'city_code': {'$regex': `^${cityCode}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results =  decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_CITY_CODE.WEIGHT);
    return results;
}

const airportSearchByAirportName = async (airportName) => {
    if (!isQueryLongerOrEqualThan(airportName, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_NAME.MIN_QUERY_LENGTH))
        return [];
    let results = await searchAirports({'airport_name': {'$regex': `^${airportName}`, '$options': 'i'}},{pagerank:-1,city_name:1 });
    results =  decorateRecordWithWeight(results, AIRPORT_SEARCH_CONFIG.BY_AIRPORT_NAME.WEIGHT);
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
    return airports.filter((v, i, a) => a.findIndex(t => isSame(t, v)) === i);
}
const findAllAirportsOfCity = async (cityCode) => {
    return await searchAirports({type: 'AIRPORT', city_code: cityCode}, {pagerank: -1, city_name: 1});
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
        let {city_code, type, belongs_to_metropolitan} = airport
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
 * @param orderBy
 * @returns {Promise<*>}
 */
const searchCities = async (query, orderBy) => {
    const CitiesModel = await getCitiesModel();
    let q = CitiesModel.find(query)
    if (orderBy)
        q = q.sort(orderBy)
    return await q.exec();
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

/**
 * By city population comparator. City with higher population will be before lower
 * @param A
 * @param B
 * @returns {number}
 */
const byPopulationComparator = (A, B) => {
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
    return cities.filter((v, i, a) => a.findIndex(t => isSame(t, v)) === i);
}

const cityLookup = async (name) => {
    if (!isQueryLongerOrEqualThan(name, LOOKUP_CONFIG.MIN_QUERY_LENGTH)) {
        return [];
    }

    const promises = [
        citySearchByCityName(name),     //search by city name in local language (e.g. Kraków)
        citySearchByAsciiName(name)];   //and also using ascii name             (e.g. Krakow)
    const results = await Promise.all(promises);
    let records = [];
    results.forEach(cities => {
        cities.forEach(airport => {
            records.push(airport)
        })
    })

    records = records.sort(multipleComparators([byPopulationComparator]));

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


