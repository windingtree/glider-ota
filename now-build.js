// const dotenv = require('dotenv').config();  //load .env
const profiles = require('@windingtree/config-profiles');
const activeProfile = process.env.ACTIVE_PROFILE || 'staging';
console.log('Active profile:', activeProfile)
console.log('__filename:',__filename);
console.log('__dirname:',__dirname);
console.log('process.cwd():',process.cwd());

profiles.init({
      dbUrl: profiles.getEnvironmentEntry(activeProfile, 'MONGO_URL'),
      encryptionDetails: profiles.getEnvironmentEntry(activeProfile, 'PROFILE_SECRET')
    }
)


profiles.dumpProfile(activeProfile).then(()=>{
  console.log(`profile ${activeProfile} successfully generated`);
  process.exit(0)
}).catch(err=>{
  console.error(`profile ${activeProfile} generation failed, ${err}`)
  process.exit(-1)
});
