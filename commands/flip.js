const fs = require('fs');
module.exports.run = async (client,message,args) => {
	var flipTable = JSON.parse(fs.readFileSync("./json/flipDict.json"));
	textArray = message.content.substring(6).split("");
	for (i=0;i<textArray.length;i++){
		if(flipTable[textArray[i]]!=null){
			textArray[i]=flipTable[textArray[i]];
		}
		else{fs.appendFile('./json/failedFlip.txt', textArray[i]+"  =  "+ textArray[i].charCodeAt(0)+"\n", function (err) {});}
	}
	message.reply('(╯°□°）╯︵ ['+textArray.reverse().join('')+']');
}

module.exports.help = {
	name: "flip",
	description: "Flips Text.",
	usage: "/flip [text to be fliped]"
}

module.exports.config = {
	enabled: true,
	aliases: []
}