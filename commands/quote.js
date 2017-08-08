const util = require('modules/util');
const dir = '../assets/quoteImgs/';
const imgs = require(dir+'quoteImgs.json');

module.exports.run = async (client,message,args) => {
	let quotesChannel = message.guild.channels.find('id', '300770429356736514') ? message.guild.channels.find('id', '300770429356736514') : message.guild.channels.find('id', '344059595506974721');
	
	if(quotesChannel){
		quotesChannel.fetchMessages().then((quotes) => {
			let quote = quotes.random().content;
			console.log(quote);
			//message.channel.send(`\`\`\`${quote}\`\`\``);

			if(args[0]=="beta" || args[0]=="b" || args[0]=="dev" || args[0]=="d"){
				let nameID = quote.split("-")[1].split(" ").find((name) => {return (name!=" " && name!="")}).toLowerCase();
				let caption = quote.split("-")[0];
				let pics = imgs[nameID];
				let pic = pics[Math.floor(Math.random() * pics.length)];
				//{ files: [ { attachment: "./assets/quoteImgs"+`/${nameID}/`+pic.file, name: pic.file } ] }
				message.channel.send(`raw:\`\`\`${quote}\`\`\`\ncaption:\`\`\`${caption}\`\`\`\nnameID:\`\`\`${nameID}\`\`\``);
				util.captionQuoteImage("./assets/quoteImgs"+`/${nameID}/`+pic.file,caption,(buffer) => {
					message.channel.send({ files: [ { attachment:buffer, name: "quote.png" } ] });
				});
			}else{
				message.channel.send(`\`\`\`${quote}\`\`\``);
			}

		});
	}
}

module.exports.help = {
	name: "quote",
	description: "Finds a random quote from the GREAT QUOTE ARCHIVE!",
	usage: "/quote <beta|b>"
}

module.exports.config = {
	enabled: true,
	aliases: []
}