module.exports.name = "music";
const ytdl = require('ytdl-core');
const imgurUploader  = require('imgur-uploader');
const util = require('modules/util');

const mongodb = require('mongodb');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;


var dispatcher = null ;
var channel = null ;
var volume = 1;

module.exports = {
	getDispatcher: () => {return dispatcher},
	getChannel: () => {return channel},
	isPaused: () => {return dispatcher.paused},

	initSettings:initSettings,
	addToQueue:addToQueue,
	getSongFromQueue:getSongFromQueue,
	join:join,
	leave:leave,
	play:play,
	stop:stop,
	pause:pause,
	resume:resume,
	skip:skip,
	setVolume:setVolume,
	list:list
}

function initSettings(){
	MongoClient.connect(url, (err,db) => {
		db.collection("settings").findOne({var:"music"},(err,data) => {
			volume=data.volume;
		});
		db.close();
	});
}

function list(callback){
	MongoClient.connect(url, (err,db) => {
		db.collection("musicqueue").find({index:{ $lt: 10 }}).sort({index:1}).toArray((err,results)=>{
			if(err) return callback(err);
			return callback(results);
		});
		db.close();
	});
}

/*addToQueue(["meo1a","meo2a","meo3a","meo4a"],"Meow Man",true,(err)=>{
	console.log("DONE!");
});*/

//getSongFromQueue(0,true,(video)=>console.log(video));

function addToQueue(video,user,prefix,callback){
	MongoClient.connect(url, (err,db) => {
		db.collection("musicqueue").count({},(err,count) => {
			video["index"]=count;

			if(video.constructor === Array){//Playlist
				let len = video.length;

				if(prefix="before"){
					db.collection("musicqueue").updateMany({},{$inc:{index:len}},(err)=>{
						if(err) console.err(err);

						let songs = []
						video.forEach((v,i) => {
							songs.push({
								index:i,
								videoID:v.id,
								title:v.title,
								user:user
							});
						});

						db.collection("musicqueue").insertMany(songs,(err)=>{return(callback(err))});

					});

				}else{//After

					let songs = []
					video.forEach((v,i) => {
						songs.push({
							index:i+count,
							videoID:v.id,
							title:v.title,
							user:user
						});
					});

					db.collection("musicqueue").insertMany(songs,(err)=>{return(callback(err))});
				}

			}

			else{//Single Video
				console.log("singles");
				db.collection("musicqueue").insertOne({
							index:count,
							videoID:video.id,
							title:video.title,
							user:user
				},(err)=>{return(callback(err))});
			}
			
		});
	});
}

function getSongFromQueue(index,shift,callback){
	MongoClient.connect(url, (err,db) => {
		db.collection("musicqueue").findOne({index:index},(err,result)=>{
			if(shift){
				db.collection("musicqueue").deleteOne({index:index},(err)=>{
						db.collection("musicqueue").updateMany({index:{$gt:index}},{$inc:{index:-1}},(err)=>{
						callback(result);
					});
				});
			}else callback(result);
		});
	});
}

function join(msg,vc){
	msg.channel.send(`Joining **#${vc.name}** voice channel!`);
	vc.join();
	channel=vc;
}

function leave(msg){
	dispatcher.end('force_stop');
	if(channel==null){
		let voiceChannel = msg.guild.channels.findAll('type','voice').find((v) => {console.log(v.name); return v.name==="Music"});
		voiceChannel.join().then(connection => {
			connection.disconnect();
			msg.channel.send(`Leaving **#Music** voice channel!`);
		});

	}else{
		channel.leave();
		msg.channel.send(`Leaving **${channel}** voice channel!`);
	}
	channel = null;	
}

function play(client,msg,videoID,user){
	let id = videoID;
	let url = `http://youtu.be/${id}`;

	let voiceChannel = client.voiceConnections.find('channel',channel);
	if(voiceChannel){

		util.fetchVideoInfo(videoID, (video) => {
			let musicEmbed = {
				color : 7419784,
				author: {name:"𝙉𝙤𝙬 𝙋𝙡𝙖𝙮𝙞𝙣𝙜..."},
				title : video.snippet.title,
				description : video.snippet.channelTitle,
				url : url,
				footer : {text:(user)?user:msg.author.username},
				timestamp: new Date(),
				thumbnail : {url:util.roulette("loading")}
			};
			msg.channel.send({embed:musicEmbed}).then(async m => {
				//Thumbnail
				util.cropThumbnail(id, (thumbnail) => {
					imgurUploader(thumbnail, {title: id}).then(data => {
						musicEmbed.thumbnail.url = data.link;
						m.edit({embed:musicEmbed});
					});		
				});
			});
		});

		const song = ytdl(url, {filter:'audioonly'});
		dispatcher = voiceChannel.playStream(song, { passes : 5, volume: volume });
		dispatcher.on('end', (end) =>{
			dispatcher=null;
			console.log("Song Ended! " + end);

			if(end === "force_stop") return;

			getSongFromQueue(0,true,(video)=>{
				if(video)
					play(client,msg,video.videoID,video.user);
			});
			
		});

		dispatcher.on('error', (err) => {
			console.error(err);
		});
	}
}

function stop(){
	dispatcher.end('force_stop');
}

function skip(){
	dispatcher.end('skip');
}

function pause(){
	dispatcher.pause();
	console.log("Song Paused!");
}

function resume(){
	dispatcher.resume();
	console.log("Song Resumed!");
}

function setVolume(msg,vol){
	if(!vol) return msg.channel.send(`Current volume is set at ${volume * 100}%`);
		if(vol < 0 || vol > 100) return msg.reply(`Please don't ear rape the others. Enter a value between 0% and 100%.`);

	msg.channel.send(`Setting volume to ${vol}%`).then(()=>{
		volume = vol / 100;
		if(dispatcher)
			dispatcher.setVolume(volume/100);

		MongoClient.connect(url, (err,db) => {
			db.collection("settings").updateOne({var:"music"},{$set:{volume:volume}});
			db.close();
		});

	});
}