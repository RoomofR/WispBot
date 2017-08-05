module.exports.name = "db";
const settings = require("../settings.json").db;

const MongoClient = require('mongodb').MongoClient;var db;
const url = `mongodb://${settings.address}:${settings.port}/${settings.db}`;

module.exports = {

	connectToServer: (callback) => {
		MongoClient.connect(url, function( err, db ) {
			db = _db;
			return callback( err );
		});
	},

	getDb: () => {
		return db;
	}
}