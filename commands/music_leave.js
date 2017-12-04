module.exports = {
	enabled: true,
	name: "leave",
	aliases: ["l","goaway"],
	users: [],
	description: "Leaves voice channel.",
	usage: "/leave",
	run: run
}

async function run(client,message,args){
	console.log("TEST",message);
}