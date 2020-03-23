const {MONGO_CONFIG,GLIDER_CONFIG,REDIS_CONFIG,SIMARD_CONFIG} = require('../config')

let buffer=[];

function printKeys(prefix,obj){
    for(let k in obj)
        buffer.push(`\n${prefix}.${k}:${obj[k]}`)
}


module.exports = (req, res) => {
    console.debug("/api/debug called - entry")
    buffer=[];
    printKeys("MONGO_CONFIG",MONGO_CONFIG);
    printKeys("GLIDER_CONFIG",GLIDER_CONFIG);
    printKeys("REDIS_CONFIG",REDIS_CONFIG);
    printKeys("SIMARD_CONFIG",SIMARD_CONFIG);
    printKeys("ENV",process.env);
    res.send(`<html><head></head><body><pre> ${buffer} </pre></body></html>`)
    console.debug("/api/test called - exit")
}
