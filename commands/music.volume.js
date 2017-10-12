module.exports.run = async (client,message,args) => {
	console.log("Music Volume");
/*	const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guilf.voiceConnection ? message.guild.voiceConnection.channel : null);
	if (!voiceChannel || (!message.member.voiceChannel)){
		return message.reply("Please be in a voice channel first!");
	}

	let vol = args.join(" ");
	if(!vol) return message.channel.send(`Current volume is set at ${client.queues.get(message.guild.id).dispatcher.volume * 100}%`);
	if(vol < 0 || vol > 100) return message.reply(`Please don't ear rape the others. Enter a value between 0% and 100%.`);

	message.channel.send(`Setting volume to ${vol}%`).then(()=>{
		message.guild.voiceConnection.volume = vol / 100;
		client.queues.get(message.guild.id).dispatcher.setVolume(vol/100);
	});*/
}

module.exports.help = {
	name: "volume",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: []
}