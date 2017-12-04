exports.run = (client) => {
	console.log("\x1b[32m%s\x1b[0m","WISP BOT : ONLINE");
	client.user.setGame('HUMAN THINGS');

	//Debug Message/Command Tester
	//client.debugMessage("/help ping");
	//client.debugMessage("/help meow");
}