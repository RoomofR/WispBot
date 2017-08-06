const util = require('modules/util');
const ytdl = require('ytdl-core');
const fetchVideoInfo = require('youtube-info');
const imgurUploader  = require('imgur-uploader');
module.exports.run = async (client,message,args) => {
	console.time('function');
	util.parseArgstoID(args, (id) => {
		if(id){
			let url = `http://youtu.be/${id}`;
			util.cropThumbnail(id, (thumbnail) => {
				imgurUploader(thumbnail, {title: id}).then(data => {
					fetchVideoInfo(id, (err, info) => {
					if(err) throw new Error(err);
					//console.log(info);
						let musicEmbed = {
							color : 7419784,
							author: {name:info.title},
							description : `${info.owner}    ${id}`,
							url : url,
							footer : {text:message.author.username},
							timestamp: new Date(),
							thumbnail : {url:data.link}
						};
						message.channel.send({embed:musicEmbed});
					});
				});		
			});
			
		}else{message.reply(`${util.roulette('search_err')} There was nothing found for **${search}**.`);}
	});
	
		
/*	youtube.searchVideos(search,1)
		.then(results => {
			if(results.length>0){
				let video = results[0];
				let videoEmbed = {
					color : 7419784,
					author: {name:video.title},
					description : `${video.channel.title}    [${video.id}]`,
					url : video.url,
					footer : {text:message.author.username},
					timestamp: new Date(),
					thumbnail : {url:`https://i3.ytimg.com/vi/${video.id}/sddefault.jpg`}
				};
				message.channel.send({embed:videoEmbed});
			}else{
				
			}
		}).catch(console.error);*/

}

module.exports.help = {
	name: "search",
	description: "Gets best result from youtube.",
	usage: "/search [search terms]"
}

module.exports.config = {
	enabled: true,
	aliases: ["s"]
}

function toHHMMSS (sec) {
	console.log(sec);
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}