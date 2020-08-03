const {GLIDER_CONFIG,SIMARD_CONFIG,GENERIC_CONFIG} = require('./_lib/config')
const {decorate} = require('./_lib/decorators');
const {insert,findOne} = require('./_lib/mongo-dao');
const {getClient} = require('./_lib/session-storage');
const {v4} = require('uuid');
const {createLogger} = require('./_lib/logger')
const logger = createLogger('/debug')


/**
 * @module endpoint /hCheck
 */


var getNamespace = require('continuation-local-storage').getNamespace;
var session = getNamespace('ota');


const healthCheckController = async (req, res) => {
    if(!GENERIC_CONFIG.ENABLE_HEALHCHECK){
        return res.status(404).send('');
    }

    let log = new StringBuffer();
    log.log("correlationID:"+session.get('correlationID'));

    logger.debug("Logger.debug()")
    logger.info("Logger.info()")
    logger.warn("Logger.warn()")
    logger.error("Logger.error()")
    console.debug("console.log()")
    console.info("console.info()")
    console.log("console.log()")
    console.warn("console.warn()")
    console.error("console.error()")


    await checkMongo(log);
    await checkRedis(log);
    await checkEnv(log);
    await checkLogging();
    res.send(`<html><head></head><body><pre> ${arrToStr(log.getBuffer())} \nCookies:${JSON.stringify(req.cookies)} \nHeaders:${JSON.stringify(req.headers)}</pre></body></html>`);
}

function arrToStr(arr){
    let str='';
    for(let i=0;i<arr.length;i++)
        str+=arr[i]+"\n";
    return str;
}

function checkEnv(log){
    log.log("***ENV check***");

    let printKeys = (prefix,obj)=>{
        for(let k in obj)
            log.log(`${prefix}.${k}:${obj[k]}`)
    }
    printKeys("GLIDER_CONFIG",GLIDER_CONFIG);
    printKeys("SIMARD_CONFIG",SIMARD_CONFIG);
    // printKeys("MONGO_CONFIG",MONGO_CONFIG);
    // printKeys("REDIS_CONFIG",REDIS_CONFIG);
    // printKeys("ELASTIC_CONFIG",ELASTIC_CONFIG);
    printKeys("ENV",process.env);
    return log;
}

async function checkMongo(log){
    let record = {data:'test record', timestamp:new Date(),id:v4()};
    log.log("***Mongo check***");
    log.log("Adding test record to the db:"+JSON.stringify(record));
    try{
        await insert('test',record);
        log.log("Record was added");
        log.log("Retrieving test record from DB");
        let result = await findOne('test',{id:record.id})
        log.log("Retrieved record:"+JSON.stringify(result));
    }catch(err){
        log.log("Exception caught:"+err.message)
    }
    return log;
}


async function checkRedis(log){
    log.log("***Redis check***");
    let record = {data:'test record', timestamp:new Date(),id:v4()};
    log.log("Adding test record to redis:"+JSON.stringify(record));
    let key='healthcheck_'+record.id;
    try{
        await getClient().multi().set(key, record).expire(key, 60).exec();
        log.log("Record was added");
        log.log("Retrieving test record from redis");
        let result = await getClient().get(key);
        log.log("Retrieved record:"+result);
    }catch(err){
        log.log("Exception caught:"+err.message)
    }

    return log;
}
function checkLogging(){
    console.debug("console level=DEBUG");
    logger.debug("logger level=DEBUG");

/*
    console.log("console level=LOG");
    logger.log("logger level=LOG");
*/

    console.info("console level=INFO");
    logger.info("logger level=INFO");

    console.warn("console level=WARN");
    logger.warn("logger level=WARN");

    console.error("console level=ERROR");
    logger.error("logger level=ERROR");
}

class StringBuffer{
    constructor(){
        this.buffer=[];
    }
    log(msg){
        this.buffer.push(msg);
        console.log(msg)
    }
    clear(){
        this.buffer=[];
    }
    getBuffer(){
        return this.buffer;
    }
}
module.exports = decorate(healthCheckController);
