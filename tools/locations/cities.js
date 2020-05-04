const csv = require('csv-parser');
const fs = require('fs');

const INPUT_FILENAME = 'cities.txt';
const OUTPUT_FILENAME = 'cities.json';

function process_locations(inputFilename,outputFilename) {
    let records = [];

    let options = {
        separator:'\t',
    headers:['geonameid','name','asciiname','alternatenames','latitude','longitude','feature_class','feature_code','country_code','cc2','admin1_code','admin2_code','admin3_code','admin4_code','population','elevation','dem','timezone','modification_date']}
    let cnt=0;
    const response =  fs.createReadStream(inputFilename)
        .pipe(csv(options))
        .on('data', (row) => {
            cnt++;
            if(cnt<5)
                console.log(row)
            if(parseInt(row.population)>300000)
                records.push(createRecord(row))

        })
        .on('end', () => {
            console.log('Input file:', inputFilename, 'Output file:', outputFilename, ',number of records in an output file:', records.length);
            saveOutput(records, outputFilename)
        });
    // response
    return records;
}


function saveOutput(records, fileName) {
    fs.createWriteStream(fileName)
        .write(JSON.stringify(records));
}

function createRecord(row) {
    return {
        primary: row.asciiname,
        secondary: row.country_code,
        search: row.alternatenames,
        latitude: row.latitude,
        longitude: row.longitude
    }
}


// convertIataAirports();
let result=process_locations(INPUT_FILENAME, OUTPUT_FILENAME)
