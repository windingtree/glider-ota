const fs = require("fs");
const MAX_LOOKUP_RESULTS=30;

let records = {
    cities: undefined,
    airports: undefined
} ;

module.exports = (req, res) => {
    console.debug("Query:", req.body );

    let type = req.body.type;
    let query = req.body.query;
    if(type !== 'airports' && type!=='cities'){
        console.warn("Unknown lookup type",type);
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json');
        res.end('Unknown lookup type');
        return;
    }
    ensureDataIsLoaded(type);
    let results = search(type,query);
    res.json({ results: results})
};

function ensureDataIsLoaded(type){
    if (records[type] === undefined) {
        console.debug(type,' not yet loaded. Will lazy load it now');
        records[type] = load(type);
    } else {
        console.debug(type,'is already previously loaded');
    }

}

function load(type) {
    let path = `./api/_data/${type}.json`;
    console.debug('Lazy loading lookup data, current path:', process.cwd(),', relative path:',path);
    let data = JSON.parse(fs.readFileSync(path));
    console.log(`Loading of ${type} completed, data size:`,data!==undefined?data.length:'EMPTY!');
    return data;
}


function search(type,query){
    let idx=0;
    return records[type].filter(rec=>{
        let searchField = rec.search!==undefined?rec.search:'';
        return (searchField.toUpperCase().search(query.toUpperCase())>-1 && idx++<MAX_LOOKUP_RESULTS)
    })
}