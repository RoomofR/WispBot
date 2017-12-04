module.exports = {
	enabled: true,
	name: "volume",
	aliases: [],
	users: [],
	description: "Adjusts volume of music.",
	usage: "/volume [0-100]",
	run: run
}

async function run(client,message,args){
	console.log("TEST",message);
}