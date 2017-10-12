const music = require('modules/music');
module.exports.run = async (client,message,args) => {

	message.channel.send("Shuffling Queue...").then(m=>{
		music.shuffle(()=>{
			m.edit("**Shuffling Complete!**");
			client.commands.get(`queue.list`).run(client,message,args);
		});
	});
	
}

module.exports.help = {
	name: "shuffle",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['s']
}