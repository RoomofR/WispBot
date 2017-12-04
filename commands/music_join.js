module.exports = {
	enabled: true,
	name: "join",
	aliases: ["j","mj"],
	users: [],
	description: "Joins voice channel.",
	usage: "/join <Voice Channel Name>",
	run: run
}

async function run(client,message,args){
	console.log(`MUSIC : ${this.name.toUpperCase()} command issued`.color('magenta'));

	let voiceChannel = message.guild.channels.findAll('type','voice');

	if(args.length <= 0) voiceChannel = voiceChannel[0];
	else voiceChannel = voiceChannel.find((v) => {return v.name===args.join(" ")});
	
	if(!voiceChannel){
		message.reply(`**Could not find voice channel called:** \`\`\`${args.join(" ")}\`\`\``);
		return;
	}
	message.channel.send(`Joining **#${voiceChannel.name}** voice channel...`)
		.then(msg => {
			client.music.join(message.guild,voiceChannel, (vc) => {
				msg.edit(`Joined **#${vc.name}** voice channel!`);
			});
		});
}