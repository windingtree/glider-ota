require('dotenv').config();  //load .env
const {getFlightsEndpointsWithJWTs} = require('../../../api/_lib/orgId');
require('chai').should();



describe('OrgId', function () {
    describe('#getFlightsEndpointsWithJWTs()', function () {
        it('should store object in session', async ()=> {
            let endpoints = await getFlightsEndpointsWithJWTs('AAA','BBB');
            endpoints.should.not.be.empty;
            endpoints.forEach(endpoint=>{
                endpoint.should.have.property('id').not.empty;
                endpoint.should.have.property('serviceEndpoint').not.empty;
                endpoint.should.have.property('jwt').not.empty;
            })
        });
    });

});


