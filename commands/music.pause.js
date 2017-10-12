const music = require('modules/music');
const util = require('modules/util');
module.exports.run = async (client,message,args) => {
	if(!music.isPaused()){
		music.pause();
		message.channel.send(util.roulette("pause"));
	}else{
		message.reply("Music is already paused!");
	}
}
module.exports.help = {
	name: "pause",
	description: "Paused the current song!",
	usage: "/music pause"
}

module.exports.config = {
	enabled: true,
	aliases: ['=', '||']
}