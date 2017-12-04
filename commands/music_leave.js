module.exports = {
	enabled: true,
	name: "leave",
	aliases: ["l","goaway"],
	users: [],
	description: "Leaves voice channel.",
	usage: "/leave",
	run: run
}

async function run(client,message,args){
	console.log(`MUSIC : ${this.name.toUpperCase()} command issued`.color('magenta'));

	if(typeof client.music.getVoiceConnection(message.guild) == 'undefined'){
		message.reply("**I can't LEAVE a channel when I not in one from the start!**");
		return;
	}

	message.channel.send(`Leaving **#${client.music.getVoiceChannel(message.guild).name}** voice channel...`)
		.then(msg => {
			client.music.leave(message.guild, (vc) => {
				msg.edit(`Left **#${vc.name}** voice channel!`);
			});
		});
}