const music = require('modules/music');
const util = require('modules/util');
module.exports.run = async (client,message,args) => {
	if(client.music.get('dispatcher')){
		music.stop(client,message);
	}else{
		message.reply(util.roulette("stop_err"));
	}
}

module.exports.help = {
	name: "stop",
	description: "Stops playing music altogether!",
	usage: "/music stop"
}

module.exports.config = {
	enabled: true,
	aliases: ['sp']
}