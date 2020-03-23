const MongoClient = require('mongodb').MongoClient;
const {MONGO_CONFIG} = require('../../config');
const {createLogger} = require('./logger');
const logger = createLogger('dao');


const ORDER_STATUSES={
    NEW:'NEW',
    FULFILLED:'FULFILLED',
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
                console.log("DB=",db)
                db.close();
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
function insert(collection, doc){
    return getConn().then(db=>{
        logger.debug("InsertOne to collection:%s",collection)
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
        return db.collection(collection).updateOne(criteria,doc);
    })
}

/**
 * Saves an order in a database (<orders> collection)
 * @param orderId
 * @param order
 * @returns {Promise<*>}
 */

function storeOrder(orderId,order){
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
    return insert('orders',order);
}


/**
 * Retrieves an order from a database
 * @param orderId
 * @returns {Promise<*>}
 */
function findOrder(orderId){
    return findOne('orders',{orderId:orderId});
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

 * @param orderId
 * @param order_status
 * @param comment
 * @param transactionDetails
 * @returns {Promise<*>}
 */
function updateOrderStatus(orderId, order_status, comment, transactionDetails){

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

    return updateOne('orders',{orderId:orderId},updates);
}

/**
 * Update order payment status in database (<orders>.order.payment_status)
 * Operation also updates <orders>.order.lastModifyDateTime and adds record to <orders>.order.transactions to log a change
 * @param orderId
 * @param payment_status
 * @param comment
 * @param transactionDetails
 * @returns {Promise<*>}
 */
function updatePaymentStatus(orderId, payment_status, comment, transactionDetails){
    let updates = {
        $set: {
            payment_status:payment_status
        },
        $currentDate: {
            lastModifyDateTime: { $type: "timestamp" }
        },
        $push: { transactions: createTransactionEntry(comment,transactionDetails) }
    }
    return updateOne('orders',{orderId:orderId},updates);
}


module.exports = {
    saveOrderInDatabase: storeOrder,findOrder,updateOrderStatus,updatePaymentStatus,ORDER_STATUSES,PAYMENT_STATUSES
}


