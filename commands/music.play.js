const music = require('../modules/music.js');
module.exports.run = async (client,message,args) => {
	console.log("Music Play");
	music.play(client,message,args[0]);
}
module.exports.help = {
	name: "play",
	description: "Plays a youtube video.",
	usage: "/play [Youtube URL|ID|Search Terms]"
}

module.exports.config = {
	enabled: true,
	aliases: ['p']
}