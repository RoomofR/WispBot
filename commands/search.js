const util = require('modules/util');
const ytdl = require('ytdl-core');
const imgurUploader  = require('imgur-uploader');
module.exports.run = async (client,message,args) => {
	util.parseArgstoID(args, (video) => {
		if(video){
			let id = video.id.videoId;
			let url = `http://youtu.be/${id}`;

			let musicEmbed = {
				color : 7419784,
				author: {name:video.snippet.title},
				description : `${video.snippet.channelTitle}    ${id}`,
				url : url,
				footer : {text:message.author.username},
				timestamp: new Date(),
				thumbnail : {url:null}
			};
			message.channel.send({embed:musicEmbed}).then(msg => {
				util.cropThumbnail(id, (thumbnail) => {
					imgurUploader(thumbnail, {title: id}).then(data => {
						musicEmbed.thumbnail.url = data.link;
						msg.edit({embed:musicEmbed});
					});		
				});
			});
		}else{message.reply(`${util.roulette('search_err')} There was nothing found for **${search}**.`);}
	});
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