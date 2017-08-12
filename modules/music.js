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
	list:list,
	clear:clear,
	shuffle:shuffle,
	remove:remove
}

function initSettings(client){
	MongoClient.connect(url, (err,db) => {
		db.collection("settings").findOne({var:"music"},(err,data) => {
			volume=data.volume;
		});
		db.close();
	});

	client.on("voiceStateUpdate",(a,b) => {
		if(b.user.bot){
			console.log("[Music] Bot was moved! VC Changing!");
			channel = b.voiceChannel;
		}
	});
}

function list(callback){
	MongoClient.connect(url, (err,db) => {
		db.collection("musicqueue").find({index:{ $lt: 10 }}).sort({index:1}).toArray((err,results)=>{

			db.collection("musicqueue").count({},(err,count) => {
				if(err) return callback(err);
				return callback(results,count);
			});
			
		});
	});
}

function remove(index,callback){
	console.log(index);
	getSongFromQueue(parseInt(index)-1,true,(song) => {
		return(callback(song.title));
	});
}

var clearPwd = util.makeid();
function clear(msg,pwd){
	if(pwd==clearPwd){
		console.log("[MUSIC] CLEARNING MUSIC QUEUE!!! "+msg.author.username);
		msg.channel.send("Clearing queue...").then(m=>{
			MongoClient.connect(url, (err,db) => {
				db.collection("musicqueue").deleteMany({},(err)=>{
					if(err)console.error(err);
					m.edit(`**${msg.author.username}** has cleared the queue!`);
				});
			});
		});
	}else{
		clearPwd = util.makeid();
		msg.reply(`**Are your sure you want to clear the music queue?**\n If so type the command again with this id: \`\`\`${clearPwd}\`\`\``)
	}
}

function shuffle(callback){
	MongoClient.connect(url, (err,db) => {
		db.collection('musicqueue').find().sort({index:1}).toArray((err,results)=>{
			if(err) console.error(err);
			let total = results.length;
			let index = util.indexShuffle(total);
			results.forEach((s,i)=>{
				db.collection('musicqueue').updateOne({_id:s._id},{$set:{index:index[i]}},(err) => {
					if(i>=total-1)return callback(total);
				});	
			});
		});
	});
}

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
								id:v.id,
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
							id:v.id,
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
							id:video.id,
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
						return(callback(result));
					});
				});
			}else return(callback(result));
		});
	});
}

function join(msg,vc){
	msg.channel.send(`Joining **#${vc.name}** voice channel!`);
	console.log(`[Music] Joining ${vc.name}`);
	vc.join().then(connection => {

	});

	channel=vc;
}

function leave(msg){

	if(dispatcher)
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

function play(client,msg,video,u){
	console.log(video);
	let id = video.id;
	let url = `http://youtu.be/${id}`;
	let user = u?u:msg.author.username
	let duration,current;

	const musicEmbed = (video) => {
		let embed = {
			color : 7419784,
			author: {name:"𝙉𝙤𝙬 𝙋𝙡𝙖𝙮𝙞𝙣𝙜..."},
			title : video.title,
			description : video.channelTitle,
			url : url,
			footer : {text:`0/${duration}   ${user}`},
			timestamp: new Date(),
			thumbnail : {url:util.roulette("loading")}
		};
		msg.channel.send({embed:embed}).then(async m => {
			//Thumbnail
			util.cropThumbnail(id, (thumbnail) => {
				imgurUploader(thumbnail, {title: id}).then(data => {
					embed.thumbnail.url = data.link;
					m.edit({embed:embed});
				});		
			});

			const updateTime = () => {
				if(current!=duration)setTimeout(updateTime,10000);
				embed.footer.text = `${(current)?current:(util.parseMS((dispatcher)?dispatcher.time:0))}/${duration} | ${user}`;
				m.edit({embed:embed});
			}
			updateTime();

		});
	}

	let voiceChannel = client.voiceConnections.find('channel',channel);
	if(voiceChannel){

		if(!video.title || !video.channelTitle || !video.duration){
			util.fetchVideoInfo(id, (newVideo) => {
				duration = util.parseISO(newVideo.duration);
				musicEmbed(newVideo);
			});
		}else {
			duration = util.parseISO(video.duration);
			musicEmbed(video)
		};

		const song = ytdl(url, {filter:'audioonly'});
		dispatcher = voiceChannel.playStream(song, { passes : 5, volume: volume });

		dispatcher.on('end', (end) =>{
			dispatcher=null;
			console.log("Song Ended! " + end);

			current = duration;

			if(end === "force_stop") return;

			getSongFromQueue(0,true,(nextVideo)=>{
				if(nextVideo){
					play(client,msg,nextVideo,video.user);
				}
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
			dispatcher.setVolume(volume);

		MongoClient.connect(url, (err,db) => {
			db.collection("settings").updateOne({var:"music"},{$set:{volume:volume}});
			db.close();
		});

	});
}