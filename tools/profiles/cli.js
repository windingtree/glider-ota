/**
 * Snippet to encrypt/decrypt entries that need to be stored in profile collection in mongo (configuration profiles)
 *
 */
const profiles = require('@windingtree/config-profiles');
profiles.executeCLI(process.argv);
