const Client = require('node-rest-client').Client;
const {offersApiConfiguration} = require('../../config');

const client = new Client();

module.exports.searchOffers=function(criteria, callback) {

    const requestParameters = {
        headers: {
            'Authorization': 'Bearer ' + offersApiConfiguration.token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        data: criteria,
        requestConfig: {
            timeout: 10000,
            noDelay: true,
            keepAlive: true,
            keepAliveDelay: 1000
        },
        responseConfig: {
            timeout: 10000 // response timeout
        }
    };


    let handleResponse = function (data, response) {
        console.log('Response received, HTTP Status:', response.statusCode);
        if (response.statusCode !== 200) {
            console.log('Error returned from API:', data, ', criteria:',JSON.stringify(criteria))
        }

        callback(data)
    };
    const request = client.post(offersApiConfiguration.searchoffers.url, requestParameters, handleResponse);
    request.on('error', function (err) {
        console.log('something went wrong on the request', err.request.options)
    });

    request.on('requestTimeout', function (req) {
        console.log('request has expired');
        req.abort()
    });

    request.on('responseTimeout', function (res) {
        console.log('response has expired');
        res.status(500).send('response has expired');
    });
    request.on('error', function (err) {
        console.log('request error', err);
        res.status(500).send('request error');
    })
};

