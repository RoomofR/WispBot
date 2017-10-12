const music = require('modules/music');
const util = require('modules/util');
const youtubeFilters = ["youtube.com","youtu.be",];
module.exports.run = async (client,message,args) => {
	if(music.getDispatcher())
			return message.reply(`Already playing song! Please stop it before playing another one!`);

	if(args.length<=0){//Resume queue
		console.log("[Music] contiune?");
		message.channel.send("Resuming from Queue!");

		music.getSongFromQueue(0,true,(video)=>{
			if(video){
				console.log("[Music] Yes!");

				autoJoin(message);

				music.play(client,message,video,video.user);

			}else return message.reply(`No songs in queue! Please specify video.`);
		});
	}else{//Search/Get Video through args
		util.parseArgstoID(args, (video) => {
			if(video && video.constructor === Array){//Playlist
				message.channel.send(`Found ${video.length} song${(video.length>1)?"s":""} in playlist.`);
				let firstSong = video.shift();

				music.addToQueue(video,message.author.username,'before',(err) => {
					if(err) console.error(err);
					if(!music.getChannel()){
						let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => { return v.name==="Music"});
						music.join(message,voiceChannel);
					}
					autoJoin(message);
					music.play(client,message,firstSong,null);
				});

			}else if(video){//Video
				autoJoin(message);
				music.play(client,message,video,null);
			}else message.reply(`${util.roulette('search_err')} No youtube video found using ${args.join(" ")}`);
		});
	}
	
}

function autoJoin(message){
	if(message.member.voiceChannel){
		music.join(message,message.member.voiceChannel);
	}//User Channel
	else{//Deafult #Music Channel
		let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => {console.log(v.name); return v.name==="Music"});
		music.join(message,voiceChannel);
	}
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