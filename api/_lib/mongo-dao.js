const MongoClient = require('mongodb').MongoClient;
const {MONGO_CONFIG} = require('./config');
const {createLogger} = require('./logger');
const logger = createLogger('dao');
const url = require('url');

const ORDER_TYPES={
    SUBOFFER:'SUBOFFER',
    MASTER:'MASTER'
}
const ORDER_STATUSES={
    NEW:'NEW',
    FULFILLING:'FULFILLING',
    FULFILLED:'FULFILLED',
    FULFILLED_PARTIALLY:'FULFILLED_PARTIALLY',
    FAILED:'FAILED'
}
const PAYMENT_STATUSES={
    NOT_PAID:'NOT_PAID',
    PAID:'PAID',
    FAILED:'FAILED',
    CANCELLED:'CANCELLED',      //payment was cancelled (e.g. after fulfilment failed)
    UNKNOWN:'UNKNOWN'           //we don't know what's the final status (rare case, e.g. if we try to cancel payment but cancellation request fails)
}

// Create cached connection variable
let _db;

// Get the connection
function getConnection() {
    return new Promise(function(resolve, reject) {
        // Get the cached connection if exists
        if (_db) {
            resolve(_db);
        }

        // Create a new connection
        else {
            MongoClient.connect(MONGO_CONFIG.URL, {useUnifiedTopology:true})
            .then(client => {
                // Register callback to close MongoDB
                process.on('exit', function () {
                    logger.info("Shutting down mongoDb connections gracefully");
                    client && client.close();
                });

                // Update cached connection and resolve
                // Get the database name from setting, or URI otherwise
                _db=client.db(MONGO_CONFIG.DBNAME || url.parse(MONGO_CONFIG.URL).pathname.substr(1));

                _db.on('close', ()=>{
                    logger.info("onclose event received");
                    _db = undefined;
                });

                resolve(_db);
            })
            .catch(error => {
                logger.error(`Error while connecting to mongoDb: ${JSON.stringify(error)}`);
                reject(error);
            });
        }

    });
}


/**
 * Helper function to insert one document to mongoDb collection
 * @param collection - name of collection to insert document to
 * @param doc - document to be inserted
 * @returns {Promise<Promise>}
 */
function insert(collection, doc) {
    return new Promise(function(resolve, reject) {
        getConnection()
        .then(db => {
            // logger.debug("InsertOne to collection:%s, Document:",collection, doc)
            db.collection(collection).insertOne(doc)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
}

const insertMany = async (collection, documents, options) => {
    const db = await getConnection();
    return db.collection(collection)
      .insertMany(
        documents,
        {
          ordered: true,
          ...(options
            ? options
            : {})
        }
      );
  };

/**
 * Helper function to find a single record (findOne) within a provided collection
 * @param collection - name of collection to search
 * @param criteria - search criteria
 * @returns {Promise<Db>}
 */
function findOne(collection, criteria){
    return new Promise(function(resolve, reject) {
        getConnection()
        .then(db => {
            db.collection(collection).findOne(criteria)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
}

const findAll = async (collection, query, options) => {
    const db = await getConnection();
    const result = await db.collection(collection)
        .find(query, options);
    return result.toArray();
};

/**
 * Helper function to update a single document (updateOne) in a collection
 * @param collection - name of collection to search
 * @param criteria - search criteria
 * @param doc - updates
 * @returns {Promise<Promise>}
 */
function updateOne(collection, criteria, doc) {
    return new Promise(function(resolve, reject) {
        getConnection()
        .then(db => {
            db.collection(collection).updateOne(criteria,doc)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
}


/**
 * Saves confirmed(re-priced) offer in a database (<orders> collection)
 * @param offer
 * @param passengers
 * @param exchangeQuote
 * @returns {Promise<*>}
 */

async function storeConfirmedOffer(offer, passengers, exchangeQuote, orderType = ORDER_TYPES.SUBOFFER, subOfferIDs = [], masterOrderId){
    let object = {
        offerId: offer.offerId,
        confirmedOffer: offer,
        passengers: passengers,
        order_status: ORDER_STATUSES.NEW,
        payment_status: PAYMENT_STATUSES.NOT_PAID,
        exchangeQuote,
        orderType,
        masterOrderId,
        subOfferIDs,
        createDate: new Date(),
        transactions: [createTransactionEntry('New order created', {
            order_status: ORDER_STATUSES.NEW,
            payment_status: PAYMENT_STATUSES.NOT_PAID
        })]
    };
    const storedOffer = await findConfirmedOffer(offer.offerId);

    if (storedOffer) {
        let updates = {
            $set: object,
            $currentDate: {
                lastModifyDateTime: { $type: "timestamp" }
            }
        }
        logger.info("Updating stored confirmed offer, offerId:%s, order_status:%s, payment_status:%s",object.offerId,object.order_status,object.payment_status)
        return updateOne('orders', { offerId: offer.offerId }, updates);
    } else {
        logger.info("Storing confirmed offer, offerId:%s, order_status:%s, payment_status:%s",object.offerId,object.order_status,object.payment_status)
        return insert('orders',object);
    }
}


/**
 * Retrieves an order from a database
 * @param offerId
 * @returns {Promise<*>}
 */
function findConfirmedOffer(offerId){
    return findOne('orders',{offerId: offerId});
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
        $push: { transactions: createTransactionEntry(comment, transactionDetails) }
    }
    //if it's a fulfillment, we need to store also travel documents (PNR, etc...)
    if(order_status === ORDER_STATUSES.FULFILLED){
        updates['$set']['confirmation'] = transactionDetails;
    }
    logger.info("Updating order status, offerId:%s, order_status:%s",offerId,order_status);

    return updateOne('orders',{offerId:offerId}, updates);

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
function updatePaymentStatus(offerId, payment_status, payment_details, comment, transactionDetails){
    let updates = {
        $set: {
            payment_status:payment_status,
            payment_details:payment_details,
        },
        $currentDate: {
            lastModifyDateTime: { $type: "timestamp" },
        },
        $push: {
            transactions: createTransactionEntry(comment, transactionDetails),
        }
    }
    logger.info("Updating payment status, offerId:%s, payment_status:%s", offerId, payment_status)
    return updateOne('orders',{offerId:offerId}, updates);
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

    return updateOne('orders',{offerId:offerId}, updates);
}

module.exports = {
    updateOrderStatus,
    updatePaymentStatus,
    ORDER_STATUSES,
    PAYMENT_STATUSES,
    ORDER_TYPES,
    insert,
    insertMany,
    findOne,
    findAll,
    storeConfirmedOffer,
    findConfirmedOffer,
    upsertOfferPassengers,
}


