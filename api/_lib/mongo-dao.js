const MongoClient = require('mongodb').MongoClient;
const {MONGO_CONFIG} = require('../../config');
const {createLogger} = require('./logger');
const logger = createLogger('dao');

const ORDER_STATUSES={
    NEW:'NEW',
    FULFILLED:'FULFILLED',
    FAILED:'FAILED'
}
const PAYMENT_STATUSES={
    NOT_PAID:'NOT_PAID',
    PAID:'PAID',
    FAILED:'FAILED'
}


let db=undefined;

function getConn(){
    if (!db){
        logger.debug("DB Conn not initialized yet - initialize now");
        db=connect();
        return db;
    }else{
        return Promise.resolve(db);
    }
}

/**
 * Boilerplate code to help to connect to mongoDb instance and database configured in MONGO_CONFIG
 * @returns {Promise<Db>}
 */
function connect(){
    return MongoClient.connect(MONGO_CONFIG.URL)
        .then(client=>{
            logger.debug("Connected to mongo - selecting db:%s",MONGO_CONFIG.DBNAME);
            db=client.db(MONGO_CONFIG.DBNAME);
            db.on('close', ()=>{
                logger.info("onclose event received")
            });

            process.on('exit', function () {
                logger.info("Shutting down mongoDb connections gracefully");
                client.close();
            });
            return db;
        }).catch(err=>{
            logger.error("Error while connecting to mongoDb")
        })
}

/**
 * Helper function to insert one document to mongoDb collection
 * @param collection - name of collection to insert document to
 * @param doc - document to be inserted
 * @returns {Promise<Promise>}
 */
async function insert(collection, doc){
    return getConn().then(db=>{
        logger.debug("InsertOne to collection:%s, Document:",collection, doc)
        return db.collection(collection).insertOne(doc);
    })
}

/**
 * Helper function to find a single record (findOne) within a provided collection
 * @param collection - name of collection to search
 * @param criteria - search criteria
 * @returns {Promise<Db>}
 */
function findOne(collection, criteria){
    return getConn().then(db=>{
        return db.collection(collection).findOne(criteria);
    })
}

/**
 * Helper function to update a single document (updateOne) in a collection
 * @param collection - name of collection to search
 * @param criteria - search criteria
 * @param doc - updates
 * @returns {Promise<Promise>}
 */
function updateOne(collection, criteria, doc){
    return getConn().then(db=>{
        logger.debug("updateOne to collection:%s, Document:",collection, doc)
        return db.collection(collection).updateOne(criteria,doc);
    })
}

/**
 * Saves an order in a database (<orders> collection)
 * @param orderId
 * @param order
 * @returns {Promise<*>}
 */

/*
async function storeOrder(orderId,order){
    let object={
        orderId:orderId,
        order:order,
        order_status:ORDER_STATUSES.NEW,
        payment_status:PAYMENT_STATUSES.NOT_PAID,
        $currentDate: {
            createDate: { $type: "timestamp" }
        },
        transaction_history:[]
    };
    return insert('orders2',order);
}
*/


/**
 * Retrieves an order from a database
 * @param orderId
 * @returns {Promise<*>}
 */
/*
function findOrder(orderId){
    return findOne('orders2',{orderId:orderId});
}
*/


/**
 * Saves confirmed(re-priced) offer in a database (<orders> collection)
 * @param confirmedOfferId
 * @param offer
 * @returns {Promise<*>}
 */

async function storeConfirmedOffer(offer, passengers){
    let object={
        offerId:offer.offerId,
        confirmedOffer:offer,
        // offerItems:offerItems,
        passengers:passengers,
        order_status:ORDER_STATUSES.NEW,
        payment_status:PAYMENT_STATUSES.NOT_PAID,
        createDate: new Date(),
        transaction_history:[]
    };

    logger.debug("CONFIRMED ORDER before save",object)

    return insert('orders2',object);
}


/**
 * Retrieves an order from a database
 * @param offerId
 * @returns {Promise<*>}
 */
async function findConfirmedOffer(offerId){
    let rec = await findOne('orders2',{"offerId":offerId});
    logger.debug("CONFIRMED ORDER from DB",rec)
    return rec;
}


function createTransactionEntry(comment, details){
    return {
        comment:comment,
        data:details,
        transactionTime:new Date()
    }
}


/**
 * Update order  status in database (<orders>.order.order_status)
 * Operation also updates <orders>.order.lastModifyDateTime and adds record to <orders>.order.transactions to log a change

 * @param offerId
 * @param order_status
 * @param comment
 * @param transactionDetails
 * @returns {Promise<*>}
 */
function updateOrderStatus(offerId, order_status, comment, transactionDetails){

    let updates = {
        $set: {
            order_status:order_status
        },
        $currentDate: {
            lastModifyDateTime: { $type: "timestamp" }
        },
        $push: { transactions: createTransactionEntry(comment,transactionDetails) }
    }
    //if it's a fulfillment, we need to store also travel documents (PNR, etc...)
    if(order_status == ORDER_STATUSES.FULFILLED){
        updates['$set']['confirmation']=transactionDetails;
    }

    return updateOne('orders2',{offerId:offerId},updates);
}

/**
 * Update order payment status in database (<orders>.order.payment_status)
 * Operation also updates <orders>.order.lastModifyDateTime and adds record to <orders>.order.transactions to log a change
 * @param offerId
 * @param payment_status
 * @param comment
 * @param transactionDetails
 * @returns {Promise<*>}
 */
function updatePaymentStatus(offerId, payment_status, comment, transactionDetails){
    let updates = {
        $set: {
            payment_status:payment_status
        },
        $currentDate: {
            lastModifyDateTime: { $type: "timestamp" }
        },
        $push: { transactions: createTransactionEntry(comment,transactionDetails) }
    }
    return updateOne('orders2',{offerId:offerId},updates);
}



/**
 * Update passengers of an offer
 * Operation also updates <orders>.order.lastModifyDateTime and adds record to <orders>.order.transactions to log a change

 * @param offerId
 * @param passengers passengers details
 * @returns {Promise<*>}
 */
function upsertOfferPassengers(offerId, passengers){

    let updates = {
        $set: {
            passengers:passengers
        },
        $currentDate: {
            lastModifyDateTime: { $type: "timestamp" }
        },
        $push: { transactions: createTransactionEntry("Update pax details",{}) }
    }
    //if it's a fulfillment, we need to store also travel documents (PNR, etc...)

    return updateOne('orders2',{offerId:offerId},updates);
}

module.exports = {
    /*storeOrder,findOrder,*/updateOrderStatus,updatePaymentStatus,ORDER_STATUSES,PAYMENT_STATUSES,
    insert,findOne,storeConfirmedOffer,findConfirmedOffer,upsertOfferPassengers
}


