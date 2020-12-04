/**
 * Snippet to encrypt/decrypt entries that need to be stored in profile collection in mongo (configuration profiles)
 *
 */
require('dotenv').config();  //load .env
const profiles = require('@windingtree/config-profiles');
const encryptionDetails = process.env.STAGING_PROFILE_SECRET;

console.log('Args:', process.argv);
if (process.argv.length <= 2) {
  console.log('Missing argument');
  return;
}
let value = process.argv[2];

let encrypted = profiles.encryptText(encryptionDetails, value);
let decrypted = profiles.decryptText(encryptionDetails, encrypted);
console.log('value to be encrypted:', value);
console.log('value after encryption:', encrypted);
console.log('decrypted again:', decrypted);
