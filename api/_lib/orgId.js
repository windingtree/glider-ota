const {createLogger} = require('./logger');
const _ = require('lodash');
const {ORGID} = require('./config');
const axios = require('axios');
const { JWK, JWT } = require('jose');
// const logger = createLogger('orgid');
// const {storeInRedis,retrieveFromRedis} = require('./session-storage');
// const CACHED_ENDPOINTS_TTL_IN_SEC=60*60*24; //available API endpoints for a given route will be 24 hrs
ORGID.OTA_ORGID = "0xf94c83b1da7bc36989b6a4f25e51ce66dd0fcd88bae1e8486495bbc03e767229"
/*
const storeInCache = (origin, destination, endpoints) =>{

}

const getFlightsEndpointsWithJWTs = async (origin, destination) =>{

    storeInRedis(redisKey,JSON.stringify(endpointsWithJWTs),CACHED_ENDPOINTS_TTL_IN_SEC);
    return endpointsWithJWTs;
}
*/

/**
 * Create JWT token for a given orgId
 * @param orgId for whom JWT should be generated (aud field in JWT)
 * @returns {Promise<string>}
 */
const createTokenForProvider = async (orgId) => {
    return await createToken(ORGID.OTA_ORGID,orgId,'24 hrs',ORGID.OTA_PRIVATE_KEY,'test');
}

let GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/windingtree/orgid-subgraph-ropsten';

/**
 * Run a query on thegraph.com API with a query provided as a parameter.
 * @param query Query to run
 * @returns {Promise<*>}
 */
const runGraphQuery = async (query) => {
    let results;
    let body = {query: query};

    try {
        let response = await axios.post(GRAPH_URL, body, {
            headers: {'Content-Type': 'application/graphql'}
        });
        if (response && response.data && response.data.data)
            results = response.data.data;
    } catch (err) {
        console.error(err)
        throw new Error(`Cannot retrieve API endpoints from OrgId:${err}`);
    }
    return results;
}

/**
 * Discover all available API endpoints (airlines/hotels) for a given search criteria
 * @param searchCriteria
 * @returns {Promise<[]>}
 */
const getEndpoints = async (searchCriteria) =>{
    let organisations=[];

    //if it's a flight search - check for available flights providers/endpoints
    if(searchCriteria.itinerary){
        let flightOrganisations=await _getActiveAirlines('AAA','BBB');//dummy O&D, it's not used yet
        organisations = [...organisations, ... flightOrganisations];
    }

    //if it's a hotel search - check for available hotels providers/endpoints
    if(searchCriteria.accommodation){
        //hotel search
        const hotelOrgs=await _getActiveHotels(10,10);//dummy lat&lon, it's not used yet
        organisations = [...organisations, ... hotelOrgs];
    }
    //extract only list of URL+DID from the list
    let endpoints = extractEndpoints(organisations);

    //for each record (URL+DID), generate JWT
    if(!isArrayEmpty(endpoints)) {
        for (const endpoint of endpoints) {
            try {
                endpoint.jwt = await createTokenForProvider(endpoint.did)
            }catch(err){
                console.error(err)
            }
        }
    }
    console.log('Discovered API endpoints:', endpoints)
    return endpoints;
}



//temporary filter - ideally thegraph query should take care of that
const filterInvalidOrganisations = (organisations) =>{
    if(isArrayEmpty(organisations))
        return organisations;
    organisations = organisations.filter(org=>{
        const {isIncluded,registrationStatus, segment, directory, organization:{id, isActive, service, publicKey}} = org;
        console.log(`Checking organisation:${id}, isIncluded:${isIncluded}, registrationStatus:${registrationStatus}, segment:${segment}`);
        if(!directory) {
            // console.log(`!directory`);
            return false;
        }
        if(!isIncluded) {
            // console.log(`!isIncluded`);
            return false;
        }
        if(!segment) {
            // console.log(`!segment`);
            return;
        }

        // const {isActive, service, publicKey} = organization;
        if(!isActive) {
            // console.log(`!isActive`);
            return false;
        }
        if(isArrayEmpty(service)){
            // console.log(`empty service`);
            return false;
        }
/*
        if(isArrayEmpty(publicKey)){
            console.log(`empty publicKey`);
            return false;
        }*/

        return true;
    })
    return organisations;
}

const extractEndpoints = (organisations) => {
    if (isArrayEmpty(organisations))
        return organisations;
    let endpoints = [];
    organisations.forEach(org => {
        const {organization: {id,did, service}} = org;
        service.forEach(svc => {
            endpoints.push({id:id, did:did, serviceEndpoint:svc.serviceEndpoint})
        })
    });
    return endpoints;
}

const createQuery = (segment) =>{
    return `query {
    directoryOrganizations(where:{segment:"${segment}", isIncluded:true}){
    id
    segment
    registrationStatus
    isIncluded
    directory{
      isRemoved
      segment
    }
    organization{
      id
      did
      isActive
      service{
        did
        serviceEndpoint
      }
      publicKey{
        publicKeyPem
        type
        controller
        note
      }
    }
  }
}`;
}

/**
 * Retrieve all hotels, exposing Winding Tree API for a given location
 *
 * @param lat
 * @param lon
 * @returns {Promise<*[]>}
 */
const _getActiveHotels = async (lat, lon) => {

    //validate (although we don't use it yet)
    if(!lat || lat<-180 || lat > 180)
        throw new RangeError("Invalid latitude");
    if(!lon || lon<-90 || lon > 90)
        throw new RangeError("Invalid longitude");

    let result = await runGraphQuery(createQuery('hotels'));
    let organisations = (result && result.directoryOrganizations)?result.directoryOrganizations:[]
    console.log('Hotels before filtering:',organisations)
    organisations = filterInvalidOrganisations(organisations)
    console.log('Final hotels:',organisations)
    return organisations;
}


const _getActiveAirlines = async (origin, destination) => {

    //validate (although we don't use it yet)
    if(!origin || origin.length!==3)
        throw new RangeError("Invalid origin");
    if(!destination || destination.length!==3)
        throw new RangeError("Invalid destination");

    let result = await runGraphQuery(createQuery('airlines'));
    let organisations = (result && result.directoryOrganizations)?result.directoryOrganizations:[]
    console.log('Airlines before filtering:',organisations)
    organisations = filterInvalidOrganisations(organisations)

    console.log('Final airlines:',organisations)
    return organisations;
}


const createToken = async (issuer, audience, expiresIn, privateKey, fragment) => {
    const priv = JWK.asKey(privateKey,{alg:'ES256K',use: 'sig'});
    return JWT.sign(
        {
        },
        priv,
        {
            audience: audience,
            ...(issuer ? { issuer: `${issuer}${fragment ? '#' + fragment : ''}` } : {}),
            expiresIn: expiresIn,
            kid: false,
            header: { typ: 'JWT' }
        }
    );
};


const isArrayEmpty = (arr) =>{
    if(!arr || !Array.isArray(arr) || arr.length === 0)
        return true;
    return false;
}


module.exports = {
    getEndpoints
}

