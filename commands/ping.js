const http = require('http');

const mongodb = require('mongodb');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;

module.exports.run = async (client,message,args) => {
	let pingEmbed = {
		color: 7419784,
		timestamp: new Date(),
		author: {
		name: "Wisp Bot [Ping Diagnostics]",
		//icon_url: "https://image.flaticon.com/icons/png/128/149/149387.png"
		},
		fields: [
			{
				name: "Client ⬌ Bot",value: "*Loading...*"
			},
			{
				name: "Bot ⬌ Database",value: "*Loading...*"
			},
			{
				name: "Bot ⬌ Web",value: "*Loading...*"
			}
		]
	};
	message.channel.send({embed:pingEmbed}).then(async msg => {/

		//Bot Client
		pingEmbed.fields[0].value=`Latency: ${(msg.createdTimestamp - message.createdTimestamp)}ms   API: ${client.ping}ms`;
		msg.edit({embed:pingEmbed});

		//Bot Database
		let dbstart = new Date();
		MongoClient.connect(url, function( err, db ) {
			if(err) pingEmbed.fields[1].value="FAILED CONNECTION!!!";
			else pingEmbed.fields[1].value=`${new Date() - dbstart}ms`;
			msg.edit({embed:pingEmbed});
			db.close();
		});

		//Bot Web
		let webstart = new Date();
		http.get({host: 'google.com', port: 80}, function(res) {
			pingEmbed.fields[2].value=`${(new Date() - webstart)}ms`;
			msg.edit({embed:pingEmbed})
		});

	});
}

module.exports.help = {
	name: "ping",
	description: "Pings Bot!",
	usage: "/ping"
}

module.exports.config = {
	enabled: true,
	aliases: ['p']
}