module.exports.run = async (client,message,args) => {
	console.log("Restarting!!!");
	process.exit(0);
}

module.exports.help = {
	name: "restart",
	description: "Restarts Bot.",
	usgae: "/r OR /restart"
}

module.exports.config = {
	enabled: true,
	aliases: ["r"]
}