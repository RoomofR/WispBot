exports.run = async (client,oldUser,newUser) => {
/*	console.log(`${oldUser.user.username} :: ${oldUser.voiceChannel.name ? oldUser.voiceChannel.name : "None"} --> ${newUser.voiceChannel.name ? newUser.voiceChannel.name : "None"}`);
*/
	
	let embed = {
		color: 7419784,
		author: {
			name:`${newUser.user.username}${newUser.nickname==null ? "" : ` (${newUser.nickname})`}`,
			icon_url:newUser.user.avatarURL
		}
	}

	//Moved to another channel
	if(typeof oldUser.voiceChannel != 'undefined' && typeof newUser.voiceChannel != 'undefined'){
		if(oldUser.voiceChannel==newUser.voiceChannel) return;
		embed.description = `MOVED [${oldUser.voiceChannel.name}] ==> [${newUser.voiceChannel.name}]`;
	}
	//Joined Channels
	else if(typeof oldUser.voiceChannel == 'undefined') embed.description = `JOINED ==> [${newUser.voiceChannel.name}]`;
	//Left Channels
	else embed.description = `[${oldUser.voiceChannel.name}] ==> LEFT`;

	newUser.guild.channels.find("name","wisp_bot")
			 .send({embed:embed});
	console.log(`${embed.author.name} :: ${embed.description}`);
}