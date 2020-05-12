require('dotenv').config();  //load .env
const {SessionStorage} = require('../../api/_lib/session-storage');
const assert = require('assert');
const {v4} = require('uuid');



describe('SessionStorage', function () {
    describe('#storeInSession()', function () {
        it('should store object in session', async ()=> {
            let sessionStorage = new SessionStorage(v4());
            let record = await sessionStorage.retrieveFromSession("key");
            assert.equal(record,undefined)

            sessionStorage.storeInSession("key",{prop:123});
            record = await sessionStorage.retrieveFromSession("key");
            assert.deepEqual(record,{prop:123})
        });
        it('should store value in session too', async ()=> {
            let sessionStorage = new SessionStorage(v4());
            let record = await sessionStorage.retrieveFromSession("key");
            assert.equal(record,undefined)

            sessionStorage.storeInSession("key","test value");
            record = await sessionStorage.retrieveFromSession("key");
            assert.equal(record,"test value")

            sessionStorage.storeInSession("key2",123);
            record = await sessionStorage.retrieveFromSession("key2");
            assert.equal(record,123)
        });

    });

});


