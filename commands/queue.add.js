const music = require('modules/music');
const util = require('modules/util');

module.exports.run = async (client,message,args) => {
	
	if(args){

		util.parseArgstoID(args, (video) => {
			if(video && video.constructor === Array){
				music.addToQueue(video,message.author.username,'after',(err) => {
					if(err) console.error(err);
					message.channel.send(`Added ${video.length} song${(video.length>1)?"s":""} to queue.`);
				});

			}else if(video){
				console.log(video);
				music.addToQueue(video,message.author.username,null,(err) => {
					if(err) console.error(err);
					message.channel.send(`Added ${video.title} to queue.`);
				});
			}else{
				message.reply(`${util.roulette('search_err')} No youtube video found using ${args.join(" ")}`);
			}
		});

	}else message.reply("Please specify video.");
}

module.exports.help = {
	name: "add",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['append','a']
}