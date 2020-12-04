/* istanbul ignore file */
const mongoose = require('mongoose');
const {MONGO_CONFIG} = require('../config');

let connectionPromise;
let db;

// Close connetion to the MongoDB on exit
process.on('beforeExit', function () {
  mongoose.disconnect();
  console.log('Disconnected from MongoDB:', new Date().toISOString());
});

const subscribeDbEvents = db => {
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.on('disconnected', () => {
    db = undefined;
    connectionPromise = undefined;
  });
};

const getMongoConnection = async () => {

  if (db) {
    return db;
  }

  let newConnection = false;

  if (!connectionPromise) {
    newConnection = true;
    connectionPromise = mongoose.createConnection(
        MONGO_CONFIG.URL,
      {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );
  }

  db = await connectionPromise;

  if (newConnection) {
    subscribeDbEvents(db);
    console.log('Connected to MongoDB:', new Date().toISOString());
  }

  return db;
};

module.exports = {
  getMongoConnection
};
