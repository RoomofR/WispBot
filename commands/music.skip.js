const music = require('modules/music');

module.exports.run = async (client,message,args) => {
	console.log("Music Skip");
	music.skip();
	message.channel.send("Skipping song...");
}
module.exports.help = {
	name: "skip",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['s']
}