const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	let vol = args.join(" ");
	music.setVolume(message,vol);
}

module.exports.help = {
	name: "volume",
	description: "Sets the global volume of bot.",
	usage: "/volume <0-100>"
}

module.exports.config = {
	enabled: true,
	aliases: ['v','vol']
}