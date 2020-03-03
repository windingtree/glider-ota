const csv = require('csv-parser');
const fs = require('fs');

const INPUT_FILENAME = 'iata_airport_list.csv';
const OUTPUT_FILENAME = 'airports.json';
const FILTER = ['AIRPORT']
    // const FILTER = ['AIRPORT','METROPOLITAN','BUS','RAIL','HELIPORT','FERRY_PORT','OFFLINE_POINT']

const types_map = {
    A:'AIRPORT',
    B:'BUS',
    R:'RAIL',
    C:'METROPOLITAN',
    H:'HELIPORT',
    P:'FERRY_PORT',
    O:'OFFLINE_POINT'
}


 async function readRawIataFile(inputFilename,outputFilename) {
    let airports = [];

    let options = {separator:'^'}
    const response =  await fs.createReadStream(inputFilename)
        .pipe(csv(options))
        .on('data', (row) => {
            if(row.city_code==='PRG' || row.city_code==='KRK' )
                console.log(row)
            airports.push(createAirportRecord(row))
        })
        .on('end', () => {
            console.log('Input file processing finished, records loaded:',airports.length);
            let filtered = filterLocations(airports);
            console.log('Filtered records count:', filtered.length,' Only following types will be saved:',FILTER);
            saveOutput(filtered,outputFilename)
        });
     // response
    return airports;
}

function filterLocations(airports){
    let filteredList = airports.filter(record=>{
        return (FILTER.indexOf(record.type)>-1)
    });

    return filteredList;
}

function saveOutput(airports, fileName) {
    fs.createWriteStream(fileName)
        .write(JSON.stringify(airports));
}

function createAirportRecord(row) {
    return {
        iata: row.por_code,
        name: row.por_name,
        cityCode: row.city_code,
        countryCode: row.country_code,
        countryName: 'TBD',
        type: types_map[row.loc_type]
    }
}


// convertIataAirports();
let result=readRawIataFile(INPUT_FILENAME, OUTPUT_FILENAME)
