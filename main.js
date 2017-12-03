//Env Setup
const clc = require('./modules/clc');
console.log(Array(42).join("="),'\n',`Process is being run in ${process.env.NODE_ENV.toUpperCase()} mode!`.bgColor('cyan'));
if (process.env.NODE_ENV !== 'production') {require('dotenv').load();}

//Required Modules
const fs = require('fs');
require('app-module-path').addPath(__dirname);
const util = require('modules/util');

const Discord = require("discord.js");

//Client Collections
const client = new Discord.Client();
client.commands = {};

//Load Commands
fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err.error());//I fucked up!
	let jsfiles = files.filter(f => f!="_template.js" && f.split(".").pop() === "js").sort();
	if(jsfiles.length<=0){console.error("No commands to load!".error());return;}
	console.log('\x1b[33m%s\x1b[0m',`Loading ${jsfiles.length} commands...`);
	let success=0,disabled=0;
	let template = require(`./commands/_template.js`);
	jsfiles.forEach((f,i) => {
		let props = require(`./commands/${f}`);
		if(!util.compareKeys(template,props)){console.error(`|Failed to load command ${i}:${f} because KEYS are NOT set!`.error());return}
		if(!props.enabled){disabled++;return}
		if(client.commands[props.name]){console.error(`|Failed to load command ${i}:${f} because NAME is already been used!`.error());return}
		let cmdInfo = {
			run: props.run,
			users: props.users,
			aliases: props.aliases,
			description: props.description,
			usage: props.usage
		}
		client.commands[props.name]=cmdInfo;
		props.aliases.forEach(alias => {
			if(client.commands[alias]){console.error(`|Failed to load alias [${alias}] for ${i}:${f}! Skipping...`.error());return}
			client.commands[alias]=cmdInfo;
		});
		success++;
	});
	console.log('\x1b[36m%s\x1b[0m',`Loaded ${success}/Disabled ${disabled}/Failed ${jsfiles.length-disabled-success} Commands`);
});

//Load Events
fs.readdir("./events/", (err, files) => {
  	if (err) console.error(err.error());//I fucked up!
  	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length<=0){console.error("No events to load!".error());return;}
	jsfiles.forEach((f,i) => {
		//console.log(i,f);
		let eventFunction = require(`./events/${f}`);
    	let eventName = f.split(".")[0];
    	client.on(eventName, (...args) => eventFunction.run(client, ...args));
	});
	console.log('\x1b[36m%s\x1b[0m',`Loaded ${jsfiles.length} events!`);
});

//Login
client.login(process.env.TOKEN);