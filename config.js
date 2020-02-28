const API_CONFIG =
    {
        //TODO - externalize token
        TOKEN: "eyJhbGciOiJFVEgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiIweEE4MjgxNzcyOTBiREFmNzhFZTcxQzA2ZTgwRTg1NzhDRkQ3MzgyQUYiLCJhdWQiOiJkaWQ6b3JnaWQ6MHg3RDRkNmQwNjU4N2RFNDhGMzM5RTIwOTY4N2ZBNTNDYzZjMTY5MzE5IiwiZXhwIjoxNTkwMTI3NTkyLCJzY29wZSI6InJlYWQ6b3JkZXJzIHJlYWQ6b2ZmZXJzIHdyaXRlOm9mZmVycyB3cml0ZTpvcmRlcnMifQ.R9og101JGJwMNpDap3-6Or4pwxjEG4Q1fGuVfWRr_VATYKq4-l5p7gDRYlrndbY4R0aSvwlh9XKVU4rV5wfXtxw",
        ENDPOINT: "https://staging.aggregator.windingtree.net/api/v1",
        REQUEST_TIMEOUT: 10000,
        RESPONSE_TIMEOUT: 10000
    };

const COMMON_RESPONSE_HEADERS =
    {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    };


module.exports = {
    API_CONFIG, COMMON_RESPONSE_HEADERS
};