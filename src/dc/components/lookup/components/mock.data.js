
//dummy airport search results for query NYC
export const airportLookupResultsNYC = {"results":[{"city_name":"Yogyakarta","city_code":"JOG","country_code":"ID","airport_name":"New Yogyakarta Int.","airport_iata_code":"YIA","type":"AIRPORT","country_name":"Indonesia"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Newark Liberty Intl","airport_iata_code":"EWR","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"John F Kennedy Intl","airport_iata_code":"JFK","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"LaGuardia","airport_iata_code":"LGA","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Metropolitan Area","airport_iata_code":"NYC","type":"METROPOLITAN","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Skyports SPB","airport_iata_code":"NYS","type":"AIRPORT","country_name":"United States"},{"city_name":"New York","city_code":"NYC","country_code":"US","airport_name":"Stewart International","airport_iata_code":"SWF","type":"AIRPORT","country_name":"United States"}]};

//dummy city search results for query LON
export  const cityLookupResultsLON = {"results":[{"city_name":"Londrina","country_code":"BR","latitude":"-23.31028","longitude":"-51.16278","country_name":"Brazil"},{"city_name":"London","country_code":"CA","latitude":"42.98339","longitude":"-81.23304","country_name":"Canada"},{"city_name":"Londonderry County Borough","country_code":"GB","latitude":"54.99721","longitude":"-7.30917","country_name":"United Kingdom"},{"city_name":"London","country_code":"GB","latitude":"51.50853","longitude":"-0.12574","country_name":"United Kingdom"},{"city_name":"New London","country_code":"US","latitude":"41.35565","longitude":"-72.09952","country_name":"United States"},{"city_name":"East London","country_code":"ZA","latitude":"-33.01529","longitude":"27.91162","country_name":"South Africa"}]}

//response from api in case of error
export const apiCallError = {
    "http_status": 400,
    "error": "INVALID_INPUT",
    "description": "Invalid request parameter, searchquery=",
    "payload": {}
};
