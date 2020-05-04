const csv = require('csv-parser');
const fs = require('fs');

const INPUT_FILENAME = 'iata_airport_list.csv';
const OUTPUT_FILENAME = 'airports.json';
const FILTER = ['AIRPORT','METROPOLITAN']
const types_map = {
    A:'AIRPORT',
    B:'BUS',
    R:'RAIL',
    C:'METROPOLITAN',
    H:'HELIPORT',
    P:'FERRY_PORT',
    O:'OFFLINE_POINT'
}


function process_airports(inputFilename, outputFilename) {
    let records = [];
    let airportToCityMap={};

    const response = fs.createReadStream(inputFilename)
        .pipe(csv({separator: '^'}))
        .on('data', (row) => {
            records.push(convertRecord(row))
            if(row.por_code === 'CDG' || row.por_code === 'KRK' || row.por_code === 'NYC' || row.por_code === 'JFK' || row.por_code === 'BRU'){
                console.log(row);
            }
        })
        .on('end', () => {
            console.log('Input file:', inputFilename, ',number of records in an input file:', records.length);
            records = filterLocations(records);
            airportToCityMap = createAirportToCityMap(records);
            console.log('Output file:', outputFilename, ',number of records in an output file:', records.length, ', location types used:', FILTER);
            saveOutput(records, outputFilename)
            saveOutput(airportToCityMap, "map-"+outputFilename);
        });
    // response
    return records;
}

function createAirportToCityMap(airports){
    let airportToCityMap = {};
    airports.map(record=>{
        // console.log(record);
        airportToCityMap[record.iata]={
            city:record.city,
            airport:record.port_name
        };
    });
    return airportToCityMap;
}

function filterLocations(airports){
    return airports.filter(record=>{
        return (FILTER.indexOf(record.type)>-1)
    });
}

function saveOutput(records, fileName) {
    fs.createWriteStream(fileName)
        .write(JSON.stringify(records));
}

function convertRecord(row) {
    return {
        primary: row.city_name,
        secondary: row.por_code,
        search: row.city_name+' '+row.por_code,
        city: row.city_name,
        port_name: row.por_name,
        iata: row.por_code,
        type: types_map[row.loc_type]
    }
}


// convertIataAirports();
let result=process_airports(INPUT_FILENAME, OUTPUT_FILENAME)
