const mongodb = require('mongodb');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;

let dbstart = new Date();
MongoClient.connect(url, function( err, db ) {
	if(err) ping="FAILED CONNECTION!!!";
	else ping=`${new Date() - dbstart}ms`;
	console.log(ping);
	db.close();
});