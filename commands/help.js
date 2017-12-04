module.exports = {
	enabled: true,
	name: "help",
	aliases: ["h"],
	users: [],
	description: "The all mighty help command!",
	usage: "/help <command>",
	run: run
}
var helpTexts='';
async function run(client,message,args){
	if(!args[0])
		message.channel.send(`= Command List =\n\n[Use /help <command> for details]\n\n${getHelpText(client)}`,{code:"asciidoc"});
	else{
		let command = args[0];
		if(typeof client.commands[command] != 'undefined'){
			command=client.commands[command];
			let helpText = `= ${command.name} = \n${command.description}\nusage :: ${command.usage}\n${(command.aliases.length>0) ? `aliases :: ${(command.aliases).join(" ")}`:""}`;
			message.channel.send(helpText,{code:"asciidoc"});
		}else message.reply("No command named:```"+command+"```");
	}
}

function getHelpText(client){
	if(helpTexts) return helpTexts
	let currentCmd;
	Object.keys(client.commands).forEach((name,i) => {
		let cmd = client.commands[name];
		if(typeof currentCmd!='undefined' && currentCmd.aliases == cmd.aliases)return;
		helpTexts+=`${name} :: ${cmd.description}\n`;
		currentCmd=cmd;
	})
	return helpTexts;
}