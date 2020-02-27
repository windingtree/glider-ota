const offersApiConfiguration =
    {
        "use_dummy_data": false,
        //TODO - externalize token
        "token": "eyJhbGciOiJFVEgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiIweEE4MjgxNzcyOTBiREFmNzhFZTcxQzA2ZTgwRTg1NzhDRkQ3MzgyQUYiLCJhdWQiOiJkaWQ6b3JnaWQ6MHg3RDRkNmQwNjU4N2RFNDhGMzM5RTIwOTY4N2ZBNTNDYzZjMTY5MzE5IiwiZXhwIjoxNTkwMTI3NTkyLCJzY29wZSI6InJlYWQ6b3JkZXJzIHJlYWQ6b2ZmZXJzIHdyaXRlOm9mZmVycyB3cml0ZTpvcmRlcnMifQ.R9og101JGJwMNpDap3-6Or4pwxjEG4Q1fGuVfWRr_VATYKq4-l5p7gDRYlrndbY4R0aSvwlh9XKVU4rV5wfXtxw",
        "searchoffers": {
            // "url": "https://wt-aggregator-3qb2x6vym.now.sh/api/v1/searchOffers",
            "url": "https://staging.aggregator.windingtree.net/api/v1/searchOffers",
            "request_timeout": 10000,
            "response_timeout": 10000,
        },
        "createWithOffer": {
            // "url": "https://wt-aggregator-3qb2x6vym.now.sh/api/v1/searchOffers",
            "url": "https://staging.aggregator.windingtree.net/api/v1/orders/createWithOffer",
            "request_timeout": 10000,
            "response_timeout": 10000,
        },
    };

const responseHeaders =
    {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'POST, GET',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
};



module.exports = {
    offersApiConfiguration,responseHeaders
};