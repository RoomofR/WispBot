console.log(`Process is being run in ${process.env.NODE_ENV.toUpperCase()} mode!`);
if (process.env.NODE_ENV !== 'production') {require('dotenv').load();}
require('app-module-path').addPath(__dirname);

const fs = require('fs');
const util = require('modules/util');
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Load Commands
fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err);//I fucked up!
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length<=0){console.log("No commands to load!");return;}
	console.log(`Loading ${jsfiles.length} commands!`);

	jsfiles.forEach((f,i) => {
		console.log(i,f);
		//TODO
	});
});

//Load Events
fs.readdir("./events/", (err, files) => {
  	if (err) console.error(err);//I fucked up!
  	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length<=0){console.log("No events to load!");return;}
	console.log(`Loading ${jsfiles.length} events!`);

	jsfiles.forEach((f,i) => {
		console.log(i,f);
		let eventFunction = require(`./events/${f}`);
    	let eventName = f.split(".")[0];
    	client.on(eventName, (...args) => eventFunction.run(client, ...args));
	});
});

client.login(process.env.TOKEN);