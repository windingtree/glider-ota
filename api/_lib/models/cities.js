const mongoose = require('mongoose');
const {getMongoConnection} = require('./mongo')

//Table which stores cities (needed to populate airport lookup field)
const schemaDefinition = new mongoose.Schema({
    city_name: String,
    country_code: String,
    country_name: String,
    asciiname: String,
    alternatenames: String,
    latitude: String,
    longitude: String,
    population: Number, //number of people in a given city
});

const getModel = async () =>{
    const db = await getMongoConnection();
    return db.model('cities', schemaDefinition,'citiescurated');

}

module.exports =  {
    getModel
};
