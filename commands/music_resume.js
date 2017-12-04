module.exports = {
	enabled: true,
	name: "resume",
	aliases: ["res",">"],
	users: [],
	description: "Resumes the current song.",
	usage: "/resume",
	run: run
}

async function run(client,message,args){
	console.log(`MUSIC : ${this.name.toUpperCase()} command issued`.color('magenta'));
}