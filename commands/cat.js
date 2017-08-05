const snekfetch = require('snekfetch');
module.exports.run = async (client,message,args) => {
	snekfetch.post('http://thecatapi.com/api/images/get?format=xml&type=gif')
	.then(r => 
		message.channel.send({embed:{color: 7419784,image: {url: r.body.toString('utf8').split('<url>')[1].split('</url>')[0]}}})
		//message.channel.send(r.body.toString('utf8').split('<url>')[1].split('</url>')[0])
		);
}

module.exports.help = {
	name: "cat",
	description: "CAAAAAAAAATTTTSSSS",
	usage: "CATS"
}

module.exports.config = {
	enabled: true,
	aliases: ['nya','meow']
}