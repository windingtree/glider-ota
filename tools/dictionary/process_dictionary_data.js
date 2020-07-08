const csv = require('csv-parser');
const fs = require('fs');
const INPUT_FOLDER = './input/';
const OUTPUT_FOLDER = './output/';
const _ = require('lodash')

const CITIES_INPUT_FILENAME = 'cities.txt';
const CITIES_OUTPUT_FILENAME = 'cities.json';

const AIRPORTS_INPUT_FILENAME = 'airports.csv';
const AIRPORTS_OUTPUT_FILENAME = 'airports.json';
const AIRPORTS_TYPES_MAP = {
    A: 'AIRPORT',
    B: 'BUS',
    R: 'RAIL',
    C: 'METROPOLITAN',
    H: 'HELIPORT',
    P: 'FERRY_PORT',
    O: 'OFFLINE_POINT'
}
const AIRPORTS_TYPE_FILTER = ['A', 'C']; //which types of ports should be allowed (A=airport, C=metropolitan)

const COUNTRIES_INPUT_FILENAME = 'countries.txt';
const COUNTRIES_OUTPUT_FILENAME = 'countries.json';

const CURRENCIES_INPUT_FILENAME = 'currencies.csv';
const CURRENCIES_OUTPUT_FILENAME = 'currencies.json';

const AIRLINES_INPUT_FILENAME = 'airlines.csv';
const AIRLINES_OUTPUT_FILENAME = 'airlines.json';

const TIMEZONES_INPUT_FILENAME = 'timezones.csv';



function loadCities() {
    let records = [];
    let options = {
        separator: '\t',
        headers: ['geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude', 'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code', 'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation', 'dem', 'timezone', 'modification_date']
    }
    return new Promise((resolve, reject) => {
        fs.createReadStream(INPUT_FOLDER + CITIES_INPUT_FILENAME)
            .pipe(csv(options))
            .on('data', (row) => {
                if (filterCity(row))
                    records.push(createCityRecord(row))
            })
            .on('end', () => {
                resolve(records);
            });
    })
}

//filter out cities with too small population
function filterCity(row) {
    return (parseInt(row.population) > 2000);
}

function createCityRecord(row) {
    return {
        city_name: row.name,
        country_code: row.country_code,
        latitude: row.latitude,
        longitude: row.longitude,
        alternatenames: row.alternatenames
    }
}


function loadAirlines() {
    let records = [];
    return new Promise((resolve, reject) => {
        const response = fs.createReadStream(INPUT_FOLDER + AIRLINES_INPUT_FILENAME)
            .pipe(csv({separator: '^'}))
            .on('data', (row) => {
                if(filterAirline(row))
                    records.push(createAirlineRecord(row))
            })
            .on('end', () => {
                resolve(records);
            });
    });
}

function createAirlineRecord(row) {
    return {
        airline_iata_code:row['2char_code'],
        airline_name:row.name
    }
}

function filterAirline(row) {
    let valid_to=row.validity_to;
    return valid_to === '';
}

function loadTimezones() {
    let airportToTimezone = {};
    let options = {
        separator: ',',
        headers: ['airportId', 'name', 'city', 'country', 'iata', 'icao', 'latitute', 'longitude', 'altitude', 'timezone', 'dst', 'tz', 'type','source']
    }
    return new Promise((resolve, reject) => {
        const response = fs.createReadStream(INPUT_FOLDER + TIMEZONES_INPUT_FILENAME)
            .pipe(csv(options))
            .on('data', (row) => {
                airportToTimezone[row['iata']]=row;
            })
            .on('end', () => {
                resolve(airportToTimezone);
            });
    });
}


function loadAirports() {
    let records = [];
    return new Promise((resolve, reject) => {
        const response = fs.createReadStream(INPUT_FOLDER + AIRPORTS_INPUT_FILENAME)
            .pipe(csv({separator: '^'}))
            .on('data', (row) => {
                if (filterAirport(row))
                    records.push(createAirportRecord(row))
            })
            .on('end', () => {
                resolve(records);
            });
    });
}

function filterAirport(row) {
    return AIRPORTS_TYPE_FILTER.indexOf(row.loc_type) > -1;
}

function createAirportRecord(row) {
    return {
        city_name: row.city_name,
        city_code: row.city_code,
        country_code: row.country_code,
        airport_name: row.por_name,
        airport_iata_code: row.por_code,
        type: AIRPORTS_TYPES_MAP[row.loc_type]
    }
}


function loadCountries() {
    let records = [];
    let options = {
        separator: '\t',
        skipComments: true,
        headers: ['iso', 'iso3', 'iso_numeric', 'flips', 'country', 'capital', 'area_sqkm', 'population', 'continent', 'tld', 'currency_code', 'currency_name', 'phone', 'postal_code', 'regex', 'languages', 'geonameid', 'neighbours', 'equivalent_cips_code']
    }
    return new Promise((resolve, reject) => {
        const response = fs.createReadStream(INPUT_FOLDER + COUNTRIES_INPUT_FILENAME)
            .pipe(csv(options))
            .on('data', (row) => {
                records.push(createCountryRecord(row))
            })
            .on('end', () => {
                resolve(records);
            });
    });
}

function createCountryRecord(row) {
    return {
        country_code: row.iso,
        country_name: row.country,
        continent_code: row.continent,
    }
}


function loadCurrencies() {
    let records = [];
    let options = {headers: ['currency_code', 'minor_unit', 'currency_name', 'entity_name'], skipLines: 1};
    return new Promise((resolve, reject) => {
        fs.createReadStream(INPUT_FOLDER + CURRENCIES_INPUT_FILENAME)
            .pipe(csv(options))
            .on('data', (row) => {
                records.push(createCurrencyRecord(row))
            })
            .on('end', () => {
                resolve(records);
            });
    });
}


function createCurrencyRecord(row) {
    return {
        currency_code: row.currency_code,
        minor_unit: row.minor_unit,
        currency_name: row.currency_name
    }
}


function saveJsonToFile(records, fileName) {
    fs.createWriteStream(fileName)
        .write(JSON.stringify(records));
}


let citiesPromise = loadCities();
let airportsPromise = loadAirports();
let countriesPromise = loadCountries();
let currenciesPromise = loadCurrencies();
let airlinesPromise = loadAirlines();
let timezonesPromise = loadTimezones();


function createCountriesMap(listOfCountries) {
    let result = {};
    _.each(listOfCountries, rec => {
        result[rec.country_code] = rec;
    })
    return result;
}

function enrichCitiesWithCountryName(listOfCities, countriesMap) {
    _.each(listOfCities, rec => {
        let country = countriesMap[rec.country_code];
        if (country) {
            rec.country_name = country.country_name;
        } else {
            console.warn("(2)Missing country data for country code:", rec.country_code,rec)
        }
    })
}
function enrichAirportsWithCountryName(listOfAirports, countriesMap) {
    _.each(listOfAirports, rec => {
        let country = countriesMap[rec.country_code];
        if (country) {
            rec.country_name = country.country_name;
        } else {
            console.warn("(2)Missing country data for country code:", rec.country_code,rec)
        }
    })
}

function enrichAirportsWithTimezone(listOfAirports, airportTimezoneMap) {
    _.each(listOfAirports, rec => {
        let airportData = airportTimezoneMap[rec.airport_iata_code];
        if (airportData) {
            rec.timezone = airportData.tz;
        } else {
            console.warn("Missing timezone data for airport:", rec.airport_iata_code)
        }
    })
}


Promise.all([citiesPromise, airportsPromise, countriesPromise, currenciesPromise, airlinesPromise, timezonesPromise]).then(function (values) {
    let currenciesList = values[3];

    let countriesList = values[2];
    let countriesMap = createCountriesMap(countriesList);

    let cityList = values[0];
    enrichCitiesWithCountryName(cityList, countriesMap);

    let airportsList = values[1];
    enrichAirportsWithCountryName(airportsList, countriesMap);

    let airlinesList = values[4];

    let airportToTimezoneMap = values[5];
    enrichAirportsWithTimezone(airportsList, airportToTimezoneMap);

    console.log("Number of currencies:",currenciesList.length)
    saveJsonToFile(currenciesList,OUTPUT_FOLDER+CURRENCIES_OUTPUT_FILENAME)

    console.log("Number of countries:",countriesList.length)
    saveJsonToFile(countriesList,OUTPUT_FOLDER+COUNTRIES_OUTPUT_FILENAME)

    console.log("Number of cities:",cityList.length)
    saveJsonToFile(cityList,OUTPUT_FOLDER+CITIES_OUTPUT_FILENAME)

    console.log("Number of airports:",airportsList.length)
    saveJsonToFile(airportsList,OUTPUT_FOLDER+AIRPORTS_OUTPUT_FILENAME);

    console.log("Number of airlines:",airlinesList.length)
    saveJsonToFile(airlinesList,OUTPUT_FOLDER+AIRLINES_OUTPUT_FILENAME)

});
