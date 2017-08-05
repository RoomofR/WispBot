const music = require('modules/music');
const util = require('modules/util');
const youtubeFilters = ["youtube.com","youtu.be",];
module.exports.run = async (client,message,args) => {
	console.log("Music Play");

	util.parseArgstoID(args, (id) => {
		if(id){
			message.reply(id);
			if(!client.music.get('voiceChannel')){
				let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => {console.log(v.name); return v.name==="Music"});
				music.join(client,message,voiceChannel);
			}
			//music.play(client,message,id);
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