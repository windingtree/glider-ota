require('dotenv').config();  //load .env
const {createLogger} = require('../../../api/_lib/logger');
const logger = createLogger('session-storage');

describe('Logger', function () {
    describe('#debug level', function () {
        it('debug level', async ()=>{
            logger.debug("Sample message - debug level")
            logger.debug("Sample message with one argument(variable) - debug level",'argument #1')
            logger.debug("Sample message with two arguments(variable) - debug level",'argument #1','argument #2')

            let arg={
                param1:'value1',
                param2:'value2',
            }
            logger.debug("Sample message with one argument(object) - debug level",arg)

            let arg2={
                param1:'value1',
                param2:'value2',
                nestedhash:{
                    nested_param1:'value3',
                    nested_param2:'value4',
                },
                nestedarr:[
                    'val1','val2'
                ]
            }

            logger.debug("Sample message with one argument (object) with nested elements - debug level",arg2)
            let arg3={
                param10:'value1',
                param22:'value2',
            }
            logger.debug("Sample message with two arguments (objects)- debug level",arg,arg3)
        });
    });
});

