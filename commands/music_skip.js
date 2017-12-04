module.exports = {
	enabled: true,
	name: "skip",
	aliases: ["sk",">>"],
	users: [],
	description: "Skips current song, and plays next in queue.",
	usage: "/skip",
	run: run
}

async function run(client,message,args){
	console.log(`MUSIC : ${this.name.toUpperCase()} command issued`.color('magenta'));
}