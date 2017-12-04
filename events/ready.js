exports.run = (client) => {
	console.log("\x1b[32m%s\x1b[0m","WISP BOT : ONLINE");
	client.user.setGame('HUMAN THINGS');
	client.music = require('modules/music')(client);

	//Debug Message/Command Tester
	//client.debugMessage("/help ping");
	//client.debugMessage("/help meow");
	//client.debugMessage("/join");
}