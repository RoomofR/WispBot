module.exports.name = "music";
const ytdl = require('ytdl-core');
const imgurUploader  = require('imgur-uploader');
const util = require('modules/util');

module.exports = {

	initQueue: () => {
/*		return musicQueue.get('queue')
			.sortBy('index')
			.value();*/
	},

	addToQueue: (id,user,index) => {
/*		musicQueue.get("queue")
			.push({
				"id":id,
				"user":user,
				"index":index,
				"time":new Date().getTime()+(dur*1000)
			})
			.write();
		//TODO*/
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

	play: (client,msg,video) => {
		let id = video.id.videoId;
		let url = `http://youtu.be/${id}`;

		let voiceChannel = client.voiceConnections.find('channel',client.music.get('voiceChannel'));
		if(voiceChannel){

			let musicEmbed = {
				color : 7419784,
				author: {name:"𝙉𝙤𝙬 𝙋𝙡𝙖𝙮𝙞𝙣𝙜..."},
				title : video.snippet.title,
				description : video.snippet.channelTitle,
				url : url,
				footer : {text:msg.author.username},
				timestamp: new Date(),
				thumbnail : {url:null}
			};
			msg.channel.send({embed:musicEmbed}).then(async msg => {

				//Thumbnail
				util.cropThumbnail(id, (thumbnail) => {
					imgurUploader(thumbnail, {title: id}).then(data => {
						musicEmbed.thumbnail.url = data.link;
						msg.edit({embed:musicEmbed});
					});		
				});
			});

			const song = ytdl(url, {filter:'audioonly'});
			let dispatcher = voiceChannel.playStream(song, { passes : 5 });
			client.music.set('dispatcher',dispatcher);
			client.music.set('isPlaying',true);

			dispatcher.on('end', () =>{
				client.music.set('dispatcher',null);
				client.music.set('isPlaying',false);
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
		msg.channel.send(util.roulette("pause"));
		client.music.get('dispatcher').pause();
		client.music.set('isPlaying',false);
		console.log("Song Paused!");
	},

	resume: (client,msg) => {
		msg.channel.send(`Resuming Song...`);
		client.music.get('dispatcher').resume();
		client.music.set('isPlaying',true);
		console.log("Song Paused!");
	}
}