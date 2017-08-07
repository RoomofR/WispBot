const mongodb = require('mongodb');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;

module.exports.name = "cleaner";
module.exports.run = async (client) => {

	MongoClient.connect(url, (err,db) => {
		if(err) console.error(err);

		//Cleans delete pool of any due/overdue messages FROM EXISTANCE!!!
		clean = () => {
			db.collection('deletepool').find().sort({time:1}).toArray((err,results) => {
				results.forEach((msg,i) => {
					if(msg.time<=new Date().getTime()){
						client.guilds.find("name",msg.guild)
									 .channels.find('name',msg.channel)
									 .fetchMessage(msg.msgid)
									 .then(m => {m.delete()});
						db.collection('deletepool').deleteOne(msg,(err)=>{if(err)console.error(err)});
					}
				});
				setTimeout(clean,3000);
			});
		};
		setTimeout(clean,1000);
	});
}

//Adds to delete pool for deletion later (duration is in seconds)
module.exports.addDeleteToPool = (msg,dur) => {

	MongoClient.connect(url, (err,db) => {
		if(err) console.error(err);
		db.collection('deletepool').insertOne({
			guild:msg.guild.name,
			channel:msg.channel.name,
			msgid:msg.id,
			time:new Date().getTime()+(dur*1000)
		}, (err) =>{ if(err)console.error(err)});
		db.close();
	});
}