module.exports.name = "mongoUtil";

const settings = require("../settings.json").db;

const url = 'mongodb://wispbot:XQ8UrUlCUPMMduezIBtcQM0oIw1M82R0@ds131583.mlab.com:31583/wispdb';

var MongoClient = require( 'mongodb' ).MongoClient;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(url, function( err, db ) {
      _db = db;
      return callback( err );
    });
  },

  getDb: function() {
    return _db;
  }
};