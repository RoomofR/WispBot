const util = require('modules/util');
const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	music.leave(client,message);
}

module.exports.help = {
	name: "leave",
	description: "Leaves voice channel.",
	usage: "/music leave"
}

module.exports.config = {
	enabled: true,
	aliases: ['l']
}