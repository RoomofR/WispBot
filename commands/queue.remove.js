const music = require('modules/music');
module.exports.run = async (client,message,args) => {
	message.channel.send(`Removing song number ${args[0]} from Queue...`).then(m=>{
		music.remove(args[0],(title)=>{
			m.edit(`**Removed** ${args[0]} : ${title} from Queue!`);
		});
	});
}

module.exports.help = {
	name: "remove",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['del','delete','d','r']
}