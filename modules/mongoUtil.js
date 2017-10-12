module.exports.name = "mongoUtil";
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;

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