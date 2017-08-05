var giphy = require('giphy-api')('4461219292df466aa171f618fc4f9a7e');
module.exports.run = async (client,message,args) => {
	giphy.random({
    tag: args.join(" "),
    //rating: 'g',
    fmt: 'json'
	}, (err, res) => {
		console.log(res.data.image_url);
		message.channel.send({embed:{color: 7419784,image: {url: res.data.image_url}}})
	});
}

module.exports.help = {
	name: "gif",
	description: "Searches function for gifs.",
	usage: "/gif [Search Terms]"
}

module.exports.config = {
	enabled: true,
	aliases: []
}

//http://imgur.com/gallery/Ritqg