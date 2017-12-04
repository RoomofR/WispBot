module.exports = {
	enabled: true,
	name: "play",
	aliases: ["p"],
	users: [],
	description: "Plays a youtube video in the voice channel.",
	usage: "/play [Youtube URL|ID|Search Terms]",
	run: run
}

async function run(client,message,args){
	console.log(`MUSIC : ${this.name.toUpperCase()} command issued`.color('magenta'));
}