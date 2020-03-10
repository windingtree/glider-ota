const Client = require('node-rest-client').Client;
const {API_CONFIG, COMMON_RESPONSE_HEADERS} = require('../../config');

const client = new Client();

function createRequest(data) {
    const requestParameters = {
        headers: {
            'Authorization': 'Bearer ' + API_CONFIG.TOKEN,
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data,
        requestConfig: {
            timeout: API_CONFIG.REQUEST_TIMEOUT,
            noDelay: true,
            keepAlive: true,
            keepAliveDelay: 1000
        },
        responseConfig: {
            timeout: API_CONFIG.RESPONSE_TIMEOUT // response timeout
        }
    };
    return requestParameters;
}

function post(url, data, callback) {
    let handleResponse = function (data, response) {
        console.debug('Response received, HTTP Status:', response.statusCode);
        if (response.statusCode !== 200) {
            console.warn('Error returned from API:', data)
        }
        callback(data)
    };

    const requestParameters = createRequest(data);
    console.debug("Search criteria:", data)
    const request = client.post(url, requestParameters, handleResponse);
    request.on('error', function (err) {
        console.error('something went wrong on the request', err.request.options)
    });

    request.on('requestTimeout', function (req) {
        console.error('request has expired');
        req.abort()
    });

    request.on('responseTimeout', function (res) {
        console.errro('response has expired');
        res.status(500).send('response has expired');
    });
    request.on('error', function (err) {
        console.log('request error', err);
    })
}


module.exports.searchOffers = function (request, response) {
    post(API_CONFIG.ENDPOINT + '/searchOffers', request, (data) => {
        // console.log(JSON.stringify(data))
        for (let header of Object.keys(COMMON_RESPONSE_HEADERS)) {
            response.setHeader(header, COMMON_RESPONSE_HEADERS[header]);
        }
        response.json(data);
    });
};


