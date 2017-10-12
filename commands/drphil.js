const quotes = require('../json/drphil.json');

module.exports.run = async (client,message,args) => {
	message.reply("```"+'"'+quotes[Math.floor(Math.random() * quotes.length)]+'" ― Phillip C. McGraw'+"```");
}

module.exports.help = {
	name: "drphil",
  description: "Gives the mighty wisdom of Dr. Phil",
  usage: "/drphil"
}

module.exports.config = {
  enabled: true,
  aliases: ["dr","phil"]
}