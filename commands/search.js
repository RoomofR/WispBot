const util = require('modules/util');
const ytapi = require('simple-youtube-api');
const youtube = new ytapi(process.env.YT_APIKEY);

module.exports.run = async (client,message,args) => {
	const search = args.join(" ");
	youtube.searchVideos(search,1)
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
				message.reply(`${util.roulette('search_err')} There was nothing found for **${search}**.`);
			}
		}).catch(console.error);
		
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