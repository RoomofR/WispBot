module.exports.name = "memeRater";

const mongodb = require('mongodb');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;
//const key = process.env.

module.exports.run = async () => {
	
	MongoClient.connect(url, (err,db) => {
		db.collection("settings").findOne({var:"visionAPI"},(err,setting) => {

			if(new Date() >= setting.date){
				//console.log("[Google VisionAPI] 24 Hour Reset");
				//db.collection("settings").updateOne({var:"visionAPI"},{date:})
			}
		})
	});
}