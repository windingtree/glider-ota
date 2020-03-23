const winston = require('winston');

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
            new winston.transports.File({filename: 'error.log', level: 'error'}),
            // new winston.transports.File({filename: 'combined.log'})
        ]
    });

    //
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }


    return logger;
}



module.exports = {createLogger}