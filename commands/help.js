module.exports.run = async (client,message,args) => {
	if(!args[0]){
		message.channel.send(`= Command List =\n\n[Use /help <command> for details]\n\n${client.help.map(c=>
		   `${c.help.name} :: ${c.help.description}`).join("\n")}`,
			{code:"asciidoc"});
	}
	else{
		let command = args[0];
		if(client.commands.has(command)){
			command = client.commands.get(command);
			let helpText = `= ${command.help.name} = \n${command.help.description}\nussage :: ${command.help.usage}\n${(command.config.aliases.length>0) ? `aliases :: ${(command.config.aliases).join(" ")}`:""}`;

			if(command.config.subCommands != null && command.config.subCommands.length > 0){
				helpText += '\nSubCommands ::'
				command.config.subCommands.forEach((s,i) => {
					helpText += `\n${s.split('.')[1]}`;
				})
			}

			message.channel.send(helpText,{code:"asciidoc"});
		}
	}
}

module.exports.help = {
	name: "help",
	description: "The all mighty help command!",
	usage: "/help [command]"
}

module.exports.config = {
	enabled: true,
	aliases: ["h"]
}