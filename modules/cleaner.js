const low = require('lowdb');
const deletePool = low('./json/deletePool.json');
module.exports.name = "cleaner";
module.exports.run = async (client) => {
	client.setInterval(cleanDeletePool,1000,client);
	deletePool.defaults({ messages: []})
		.write();
}

//Adds to delete pool for deletion later (duration is in seconds)
module.exports.addDeleteToPool = (msg,dur) => {
	deletePool.get("messages")
		.push({
			"guild":msg.guild.name,
			"channel":msg.channel.name,
			"msgid":msg.id,
			"time":new Date().getTime()+(dur*1000)
		})
		.write();
}

//Cleans delete pool of any due/overdue messages FROM EXISTANCE!!!
function cleanDeletePool(client){
	let messages = 
	deletePool.get('messages')
		.sortBy('time')
		.take(5)
		.value();

	messages.forEach((msg,i) => {
		if(msg.time<=new Date().getTime()){
			client.guilds.find("name",msg.guild)
						 .channels.find('name',msg.channel)
						 .fetchMessage(msg.msgid)
						 .then(m => {m.delete()});
			deletePool.get('messages')
				.remove({msgid:msg.msgid})
				.write();
		}
	});	
}