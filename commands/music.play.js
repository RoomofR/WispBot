const music = require('modules/music');
const util = require('modules/util');
const youtubeFilters = ["youtube.com","youtu.be",];
module.exports.run = async (client,message,args) => {
	if(client.music.get('dispatcher'))
		return message.reply(`Already playing song! Please stop it before playing another one!`);

	util.parseArgstoID(args, (video) => {
		if(video){
			if(!client.music.get('voiceChannel')){
				let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => { return v.name==="Music"});
				music.join(client,message,voiceChannel);
			}
			music.play(client,message,video);
		}else{
			message.reply(`${util.roulette('search_err')} No youtube video found using ${args.join(" ")}`);
		}
	});
}
module.exports.help = {
	name: "play",
	description: "Plays a youtube video.",
	usage: "/play [Youtube URL|ID|Search Terms]"
}

module.exports.config = {
	enabled: true,
	aliases: ['p']
}