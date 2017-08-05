module.exports.run = async (client,message,args) => {
	console.log("Music Stop");
/*	const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guilf.voiceConnection ? message.guild.voiceConnection.channel : null);
	if (!voiceChannel || (!message.member.voiceChannel)){
		return message.reply("Please be in a voice channel first!");
	}

	if(client.queues.has(message.guild.id)) {
		const queue = client.queues.get(message.guild.id);
		queue.queue = [];
		queue.dispatcher.end();
	}*/
}

module.exports.help = {
	name: "stop",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: []
}