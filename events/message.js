exports.run = async (client,message) => {
	//LOG TO CONSOLE
	console.log(`[${message.channel.guild.name}:${message.channel.name}] ${message.author.username} : ${message.content}`);

	if(message.author.bot || message.channel.type === 'dm') return;
	if(util.matches(settings.textChannel,message.channel.name)) return;
	//Command Handler
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if(!command.startsWith(prefix)) return;

	let cmd = client.commands.get(command.slice(prefix.length));
	if(cmd) cmd.run(client,message,args);
}