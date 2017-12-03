module.exports = {
	enabled: true,
	name: "restart",
	aliases: ["r"],
	users: [],
	description: "TODO",
	usage: "TODO",
	run: run
}

function run(client,message,args){
	console.log("TEST",message.content,"DONE!");
}