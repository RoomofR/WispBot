module.exports.run = async (client,message,args) => {

	if(args.length>0){
		let cmd = client.commands.get(`queue.${args[0]}`);
		
		if(cmd) cmd.run(client,message,args.slice(1));
	}else{
		let command = client.commands.get('queue');let helpText = `= ${command.help.name} = \n${command.help.description}\nussage :: ${command.help.usage}\n${(command.config.aliases.length>0) ? `aliases :: ${(command.config.aliases).join(" ")}`:""}`;
		helpText += '\nSubCommands ::';command.config.subCommands.forEach((s,i) => {helpText += `\n${s.split('.')[1]}`;})
		message.reply(`ERROR:\n\`\`\`asciidoc\n${helpText}\n\`\`\``);
	}
}

module.exports.help = {
	name: "queue",
	description: "For all your qeueuing needs.",
	usage: "/queue [add|remove|list]"
}

module.exports.config = {
	enabled: true,
	aliases: ["q"],
	subCommands: []
}