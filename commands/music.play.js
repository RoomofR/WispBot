const music = require('modules/music');
const util = require('modules/util');
const youtubeFilters = ["youtube.com","youtu.be",];
module.exports.run = async (client,message,args) => {
	if(music.getDispatcher())
			return message.reply(`Already playing song! Please stop it before playing another one!`);

	if(args.length<=0){
		console.log("[Music] contiune?");
		music.getSongFromQueue(0,true,(video)=>{
			if(video){
				console.log("[Music] Yes!");
				args[0]=video.videoID;
				play(client,message,args);
			}else{
				return message.reply(`Please specify video.`);
			}
		});
	}else{
		play(client,message,args);
	}

	
}

function play(client,message,args){
	util.parseArgstoID(args, (video) => {

		if(video.constructor === Array){
			message.channel.send(`Found ${video.length} song${(video.length>1)?"s":""} in playlist.`);
			let firstSong = video.shift()
			music.addToQueue(video,message.author.username,'before',(err) => {
				if(err) console.error(err);

				if(!music.getChannel()){
					let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => { return v.name==="Music"});
					music.join(message,voiceChannel);
				}
				music.play(client,message,firstSong.id,null);

			});
		}
		else if(video){
			if(!music.getChannel()){
				let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => { return v.name==="Music"});
				music.join(message,voiceChannel);
			}
			music.play(client,message,video.id,null);
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