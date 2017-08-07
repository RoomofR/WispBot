const music = require('modules/music');
const util = require('modules/util');
module.exports.run = async (client,message,args) => {
	console.log("Music Queue");

	util.parseArgstoID(args, (video) => {
		music.addToQueue(video,message.author.id);
	});
}
module.exports.help = {
	name: "queue",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: []
}