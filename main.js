console.log(`Process is being run in ${process.env.NODE_ENV.toUpperCase()} mode!`);
if (process.env.NODE_ENV !== 'production') {require('dotenv').load();}
require('app-module-path').addPath(__dirname);

const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "/";



client.on('ready', () => {
	console.log("WISP BOT : ONLINE");
	client.user.setGame('HUMAN THINGS');
});

client.login(process.env.TOKEN);