const music = require('modules/music');
module.exports.run = async (client,message,args) => {

	if(args.length>0){//Specified channel
		let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => {return v.name===args.join(" ")});
		if(voiceChannel){
			music.join(client,message,voiceChannel);
		}else message.reply(`**Could not find voice channel called:** \`\`\`${args.join(" ")}\`\`\``);
	}else if(message.member.voiceChannel){music.join(client,message,message.member.voiceChannel);}//User Channel
	else{//Deafult #Music Channel
		let voiceChannel = message.guild.channels.findAll('type','voice').find((v) => {console.log(v.name); return v.name==="Music"});
		music.join(client,message,voiceChannel);
	}
}

module.exports.help = {
	name: "join",
	description: "Joins voice channel.",
	usage: "/music join <Voice Channel Name>"
}

module.exports.config = {
	enabled: true,
	aliases: ['j']
}