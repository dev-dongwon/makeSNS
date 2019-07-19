const mongoose = require('mongoose'),
      config   = require('../config/index');

mongoose.Promise = global.Promise;

const connectMongoDb = async () => {
  
  try {
    const db = mongoose.connection;
    db.once('open', function() {
      console.log('Conneted mongoDB');
    });
    await mongoose.connect(config.mongoUrl, { useNewUrlParser: true });
    
  } catch (error) {
    console.error('Connection Error');
    return;
  }
}

module.exports = connectMongoDb;