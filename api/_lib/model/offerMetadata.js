const mongoose = require('mongoose');
const {getMongoConnection} = require('./mongo')


const offerMetadataSchema = new mongoose.Schema({
    offerId: {type: String, required: true},
    id: {type: String, required: true},
    serviceEndpoint: {type: String, required: true},
    jwt: {type: String, required: true}
});

const getModel = async () =>{
    const db = await getMongoConnection();
    return db.model('OfferMetadata', offerMetadataSchema);

}

const storeOffersMetadata = (offersMeta) => {
    return Promise.all(
        offersMeta.map(offer => {
            return storeOfferMetadata(offer.offerId,offer.endpoint)
        })
    );
}
const storeOfferMetadata = async (offerId, endpoint) =>{
    let OfferMetadata = await getModel();
    let {id,serviceEndpoint,jwt}=endpoint;
    let record = new OfferMetadata({offerId:offerId, id:id, serviceEndpoint:serviceEndpoint, jwt:jwt})
    return await record.save();
}

const getOfferMetadata = async (offerId) =>{
    let OfferMetadata = await getModel();
    let result = await OfferMetadata.findOne({offerId:offerId}).exec();
    return result;
}



module.exports =  {
    storeOffersMetadata,getOfferMetadata
};
