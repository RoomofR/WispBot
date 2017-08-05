module.exports.run = async (client,message,args) => {
	console.log("Music Pause");
/*	const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guilf.voiceConnection ? message.guild.voiceConnection.channel : null);
	
	if (!voiceChannel || (!message.member.voiceChannel)) return message.reply("Please be in a voice channel first!");

	if(client.queues.get(message.guild.id).dispatcher.paused) return message.reply("It's already paused idiot!");
	//ZA WARUDO ! TOKI WO TOMARE !
	message.send('Pausing music...').then(()=>{
		client.queues.get(message.guild.id).dispatcher.pause();
	});*/
}
module.exports.help = {
	name: "pause",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: []
}