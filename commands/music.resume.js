const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	if(music.isPaused()){
		music.resume();
		message.channel.send(`Resuming Song...`);
	}else{
		message.reply("Music is already resumed!");
	}
}
module.exports.help = {
	name: "resume",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['>','r']
}