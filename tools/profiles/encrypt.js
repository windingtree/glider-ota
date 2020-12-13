/**
 * Snippet to encrypt/decrypt entries that need to be stored in profile collection in mongo (configuration profiles)
 *
 */
require('dotenv').config();  //load .env
const profiles = require('@windingtree/config-profiles');
const encryptionDetails = process.env.STAGING_PROFILE_SECRET;

/*console.log('Args:', process.argv);
if (process.argv.length <= 2) {
  console.log('Missing argument');
  return;
}*/
let value = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6b3JnaWQ6MHhkYTI4MTZhYTM0N2NlNjRmNWI5ZTg0MWQwZWY3Mjg2MzliYmI0MjE1NTY0Yjc2ZGQ3YzEyYmI0MmE5OWE5MjBkI3dlYnNlcnZlciIsImlhdCI6MTYwNDkzNjkyNiwiZXhwIjoxNjM2NDk0NTI2fQ.uhLTmv3GvqxKcsqsIWipGJBVfGrXP-sM0zCS8vBk62ryLcR-8CzkA_7C5-qiYFKfXmxYwJuDpxh2HwaY1JM1mw"

let encrypted = profiles.encryptText(encryptionDetails, value);
let decrypted = profiles.decryptText(encryptionDetails, encrypted);
console.log('value to be encrypted:', value);
console.log('value after encryption:', encrypted);
console.log('decrypted again:', decrypted);
