const snekfetch = require('snekfetch');
const https = require('https');
module.exports.run = async (client,message,args) => {
	https.get('https://random.dog/woof.json', function(res){
	    let body = '';
	    res.on('data', function(chunk){body += chunk;});

	    res.on('end', function(){
	        message.channel.send({embed:{color: 7419784,image: {url: JSON.parse(body).url}}});
	    });
	});
}

module.exports.help = {
	name: "dog",
	description: "Generates random dog picture.",
	usgae: "/dog"
}

module.exports.config = {
	enabled: true,
	aliases: ["woof","inu"]
}