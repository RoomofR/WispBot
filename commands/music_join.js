module.exports = {
	enabled: true,
	name: "join",
	aliases: ["j","mj"],
	users: [],
	description: "Joins voice channel.",
	usage: "/join <Voice Channel Name>",
	run: run
}

async function run(client,message,args){
	console.log(`MUSIC : ${this.name.toUpperCase()} command issued`.color('magenta'));
}