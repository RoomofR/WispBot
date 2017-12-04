const settings = require('../settings.json');

exports.run = async (client,message) => {
	//===LOG TO CONSOLE===
	console.log(`[${message.channel.guild.name}:${message.channel.name}] ${message.author.username} : ${message.content}`);

	//===COMMAND HANDLER===
	//Prevent reading of DMs and itself
	if(message.author.bot || message.channel.type === 'dm') return;
	if(!message.channel.name.matches(settings.textChannel)) {
		//TODO add to delete pool if command
		return
	};

	//Split and Format Command and Arguments
	let messageArray = message.content.split(" ");
	let command = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);

	//Get Command Object from Client.Commands
	if(!command.startsWith(settings.prefix)) return;
	let cmd = client.commands[command.slice(settings.prefix.length)]

	//User Permissions Check
	if(cmd.users.length!=0 && !message.author.id.matches(cmd.users)) {
		message.reply('```Sorry you dont have permissions to use the '+command.toUpperCase()+' command!```');
		return;
	}

	//Run Command
	if(cmd) cmd.run(client,message,args);
}