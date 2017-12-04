module.exports = {
	enabled: true,
	name: "restart",
	aliases: ["r"],
	users: ["181114372872077313"],
	description: "Restarts Bot.",
	usage: "/r OR /restart",
	run: run
}

function run(client,message,args){
	console.log("Restarting!!!".bgColor("red"));
	process.exit(0);
}