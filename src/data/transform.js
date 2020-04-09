const {extendResponse} = require("../utils/flight-search-results-transformer");
const offline_flight_results = require("../data/sample_response_flights");
const fs = require('fs');


let results = extendResponse(offline_flight_results);

fs.createWriteStream("sample_response_flights_transformed.json")
    .write(JSON.stringify(results));