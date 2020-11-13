const dotenv = require('dotenv').config();  //load .env
const profiles = require('@windingtree/config-profiles');
const activeProfile = profiles.determineActiveProfile();
console.log('activeProfile:',activeProfile);
console.log('__filename:',__filename);
console.log('__dirname:',__dirname);
console.log('process.cwd():',process.cwd());

const dbUrl = profiles.getEnvironmentEntry( activeProfile,'MONGO_URL');
// console.log(process.env)
profiles.init({dbUrl:dbUrl})

profiles.dumpProfile(activeProfile).then(()=>{
  console.log(`profile ${activeProfile} successfully generated`);
  process.exit(0)
}).catch(err=>{
  console.error(`profile ${activeProfile} generation failed, ${err}`)
  process.exit(-1)
});
