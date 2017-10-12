const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	if(music.getChannel())
		music.leave(message);
	else return message.reply("Can't leave voice channel when there is nothing to leave from!");
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