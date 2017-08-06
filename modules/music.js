module.exports.name = "music";
const low = require('lowdb');
const ytdl = require('ytdl-core');
const imgurUploader  = require('imgur-uploader');
const util = require('modules/util');
const musicQueue = low('./json/musicQueue.json');
musicQueue.defaults({ queue: []}).write();


module.exports = {

	initQueue: () => {
		return musicQueue.get('queue')
			.sortBy('index')
			.value();
	},

	addToQueue: (id,user,index) => {
		musicQueue.get("queue")
			.push({
				"id":id,
				"user":user,
				"index":index,
				"time":new Date().getTime()+(dur*1000)
			})
			.write();
		//TODO
	},

	join: (client,msg,vc) => {
		msg.channel.send(`Joining **#${vc.name}** voice channel!`);
		vc.join();
		client.music.set('voiceChannel',vc);
	},

	leave: (client,msg) => {
		if(client.music.get('voiceChannel')==null){
			let voiceChannel = msg.guild.channels.findAll('type','voice').find((v) => {console.log(v.name); return v.name==="Music"});
			voiceChannel.join().then(connection => {
				connection.disconnect();
				msg.channel.send(`Leaving **#Music** voice channel!`);
			});

		}else{
			client.music.get('voiceChannel').leave();
			msg.channel.send(`Leaving **${client.music.get('voiceChannel')}** voice channel!`);
		}
		client.music.set('voiceChannel',null);
	},

	play: (client,msg,ytid) => {
		let url = `http://youtu.be/${ytid}`;
		let voiceChannel = client.voiceConnections.find('channel',client.music.get('voiceChannel'));
		if(voiceChannel){

			util.cropThumbnail(ytid, (thumbnail) => {
				imgurUploader(thumbnail, {title: ytid}).then(data => {
					ytdl.getInfo(url, (err, info) => {
						console.log(`[Music] Playing ${info.title}`);
						let musicEmbed = {
							color : 7419784,
							author: {name:"𝙉𝙤𝙬 𝙋𝙡𝙖𝙮𝙞𝙣𝙜..."},
							title : info.title,
							description : info.author.name,
							url : url,
							footer : {text:msg.author.username},
							timestamp: new Date(),
							thumbnail : {url:data.link}
							//thumbnail : thumnail
						};
						//msg.channel.send("meow");
						msg.channel.send({embed:musicEmbed});
					});
				});
				
			});

			const song = ytdl(url, {filter:'audioonly'});
			let dispatcher = voiceChannel.playStream(song, { passes : 12 });
			client.music.set('dispatcher',dispatcher);

			dispatcher.on('end', () =>{
				client.music.set('dispatcher',null);
				console.log("Song Ended!");
			});
		}
	},

	stop: (client,msg) => {
		msg.channel.send(`Stopping Song...`);
		client.music.get('dispatcher').end();
		client.music.set('dispatcher',null);
		console.log("Song Stoped!");
	},

	pause: (client,msg) => {
		msg.channel.send(`Pausing Song...`);
		client.music.get('dispatcher').pause();
		console.log("Song Paused!");
	},

	resume: (client,msg) => {
		msg.channel.send(`Resuming Song...`);
		client.music.get('dispatcher').resume();
		console.log("Song Paused!");
	}
}