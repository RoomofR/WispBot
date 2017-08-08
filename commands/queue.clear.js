const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	music.clear(message,args[0]);
}

module.exports.help = {
	name: "clear",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['c']
}