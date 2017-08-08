const safeEval = require('safe-eval');

//Modules
const music = require('modules/music');
const util = require('modules/util');

module.exports.run = async (client,message,args) => {
	let start = new Date();
	var evaluated = safeEval(args.join(" "));
	let totalTime = new Date() - start;

	message.reply(`\`\`\`js\n${args.join(" ")}\`\`\`\n\`\`\`js\n${evaluated}\`\`\``,`${totalTime}ms`);
}

module.exports.help = {
	name: "eval",
	description: "Runs Javascript Snippit!",
	usage: "/eval <code>"
}

module.exports.config = {
	enabled: true,
	aliases: ['e']
}