module.exports.run = async (client,message,args) => {
	console.log("Music Resume");
/*	const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guilf.voiceConnection ? message.guild.voiceConnection.channel : null);
	
	if (!voiceChannel || (!message.member.voiceChannel)) return message.reply("Please be in a voice channel first!");

	if(!client.queues.get(message.guild.id).dispatcher.paused) return message.reply("It's already resumed idiot!");
	//ZA WARUDO ! TOKI WO MODORE ! 
	message.send('Resuming music...').then(()=>{
		client.queues.get(message.guild.id).dispatcher.resume();
	});*/
}
module.exports.help = {
	name: "resume",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: []
}