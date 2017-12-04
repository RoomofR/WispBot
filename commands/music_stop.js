module.exports = {
	enabled: true,
	name: "stop",
	aliases: ["staph","s"],
	users: [],
	description: "Stops the playing of music.",
	usage: "/stop",
	run: run
}

async function run(client,message,args){
	console.log("TEST",message);
}