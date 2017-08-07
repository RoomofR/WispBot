const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	if(client.music.get('isPlaying')){
		music.pause(client,message);
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