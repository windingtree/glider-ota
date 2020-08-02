const winston = require('winston');
const { Client } = require('@elastic/elasticsearch');
const { ELASTIC_CONFIG } = require('./config');
var Elasticsearch = require('winston-elasticsearch');
/*const client = new Client({
    node: ELASTIC_CONFIG.URL,
    name: 'glider-ota',
    index: 'ota-default'
});*/

/**
 * Module used for logging.
 * It uses 'Winston' logger which can be further customized to add additional transports (e.g. Elastic)
 * @module _lib/logger
 */


let esTransportOpts = {
    level: 'debug',
    indexPrefix:'ota-log',
    clientOpts: { node: ELASTIC_CONFIG.URL }
};

/**
 * Create new instance of a logger.
 * @param loggerName name of the logger (usually unique name per module/functionality)
 * @returns {Logger}
 */
function createLogger(loggerName) {
    const logger = winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({stack: true}),
            winston.format.splat(),
            winston.format.simple()
            // winston.format.json()
        ),
        defaultMeta: {logger: loggerName},
        transports: [
            //
            // - Write to all logs with level `info` and below to `combined.log`
            // - Write all logs error (and below) to `error.log`.
            //
            // new winston.transports.File({filename: 'error.log', level: 'error'}),
            // new winston.transports.File({filename: 'combined.log'}),
            // new Elasticsearch(esTransportOpts),
            new winston.transports.Console({format: winston.format.simple()})
        ]
    });

    //
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
//     if (process.env.NODE_ENV !== 'production') {
       /* logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));*/
    // }


    return logger;
}



module.exports = {createLogger}
