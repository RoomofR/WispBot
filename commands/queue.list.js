const music = require('modules/music');

module.exports.run = async (client,message,args) => {
	music.list((results,count)=>{
		//console.log(results);
		let fields = [];
		results.forEach((m,i) => {
			fields.push({
				name:`[${m.index+1}]\u2003${m.title}`,
				value:`➥ ${m.videoID} - ${m.user}`
			});
		});
		let embed = {
			color: 7419784,
			timestamp: new Date(),
			author: {
				name: `𝐌𝐔𝐒𝐈𝐂 𝐐𝐔𝐄𝐔𝐄 𝐋𝐈𝐒𝐓 : ${count} song${(count>1)?"s":""}`
			},
			fields: fields
		}

		message.channel.send({embed:embed});

	});
}

module.exports.help = {
	name: "list",
	description: "TODO",
	usage: "TODO"
}

module.exports.config = {
	enabled: true,
	aliases: ['l']
}