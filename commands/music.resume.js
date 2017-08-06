const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	if(!client.music.get('isPlaying')){
		music.resume(client,message);
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
	aliases: []
}