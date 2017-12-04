module.exports = {
	enabled: true,
	name: "pause",
	aliases: ["||","="],
	users: [],
	description: "Pauses the current song.",
	usage: "/pause",
	run: run
}

async function run(client,message,args){
	console.log("TEST",message);
}