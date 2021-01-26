const mongoose = require('mongoose');
const {getMongoConnection} = require('./mongo')

//Table which stores airports (needed to populate airport lookup field)
const schemaDefinition = new mongoose.Schema({
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
});

const getModel = async () =>{
    const db = await getMongoConnection();
    return db.model('airports', schemaDefinition,'airportscurated');

}

module.exports =  {
    getModel
};
