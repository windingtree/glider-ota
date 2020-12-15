const winston = require('winston');
const fs = require('fs');
/*const client = new Client({
    node: ELASTIC_CONFIG.URL,
    name: 'glider-ota',
    index: 'ota-default'
});*/
/*
let esTransportOpts = {
    level: 'debug',
    indexPrefix:'ota-log',
    clientOpts: { node: ELASTIC_CONFIG.URL }
};
*/

function createLogger(loggerName) {
    const logger = winston.createLogger({
        level: 'info',
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


// eslint-disable-next-line no-unused-vars
const logRQRS = (data = '', suffix = '', provider = '') => {
    const FOLDER = '/home/kurt/projects/glider-ota/temp';
    let ts = Date.now();
    let extension = 'json';
    try {
        if (typeof data === 'string') {
            if (data.search('<soap') > -1 || data.search('<?xml') > -1)
                extension = 'xml';
        }
        if (extension === 'json' && typeof data === 'object')
            // data = JSON.stringify(data);
            data = stringifyCircular(data);

        let filename = `log-${ts}-${suffix}-${provider}.${extension}`;
        fs.writeFileSync(`${FOLDER}/${filename}`, data);
    } catch (e) {
        console.error('Cant log request', e);
    }

};
// Stringify object with circular structures
const stringifyCircular = (obj, indent = null) => {
    let cache = [];

    return JSON.stringify(obj, (key, value) => {

        if (value instanceof Error) {

            const obj = {};
            Object.getOwnPropertyNames(value).forEach(key => {
                obj[key] = value[key];
            });

            return obj;
        }

        if (typeof value === 'object' && value !== null) {

            if (cache.indexOf(value) >= 0) {

                return;
            }

            cache.push(value);
        }

        return value;
    }, indent ? indent : undefined);
};

module.exports = {createLogger, logRQRS}
