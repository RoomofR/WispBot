const util = require('modules/util');

module.exports.run = async (client,message,args) => {
	//client.modules.get("cleaner").addDeleteToPool(message,2);
}

module.exports.help = {
	name: "test",
	description: "Just A Test Function.",
	usage: "/test <args>"
}

module.exports.config = {
	enabled: true,
	aliases: ["t"]
}