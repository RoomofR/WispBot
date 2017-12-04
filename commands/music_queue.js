module.exports = {
	enabled: true,
	name: "queue",
	aliases: ["q"],
	users: [],
	description: "Queues a song to list.",
	usage: "/queue [Youtube URL|ID|Search Terms]",
	run: run
}

async function run(client,message,args){
	console.log("TEST",message);
}