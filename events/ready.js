exports.run = (client) => {
	console.log("WISP BOT : ONLINE".color("green"));
	client.user.setGame('HUMAN THINGS');

	client.music = require('modules/music')(client);
	client.json = require('modules/json');

	//Debug Message/Command Tester
	//client.debugMessage("/help ping");
	//client.debugMessage("/help meow");
	//client.debugMessage("/join");
}