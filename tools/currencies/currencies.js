const csv = require('csv-parser');
const fs = require('fs');

function parse_csv(inputFilename,outputFilename) {
    let records = {};
    let options = {headers:['currency_code','minor_unit','currency_name','entity_name'],skipLines:1};
    let cnt=0;
    fs.createReadStream(inputFilename)
        .pipe(csv(options))
        .on('data', (row) => {
            cnt++;
            if(cnt<5)
                console.log(row)
            records[row.currency_code]={
                minor_unit: row.minor_unit,
                currency_name: row.currency_name
            }
        })
        .on('end', () => {
            console.log('Input file:', inputFilename, 'Output file:', outputFilename, ',number of records in an output file:', records.length);
            fs.createWriteStream(outputFilename)
                .write(JSON.stringify(records));
        });
    return records;
}

parse_csv('currencies.csv', 'currencies.json');
