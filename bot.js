require('app-module-path').addPath(__dirname);
const Discord = require('discord.js');
const fs = require('fs');
const prefix = require('./settings.json').prefix;

//Web Client
require('modules/webClient').run();

require('modules/memeRater').run();

//Client/Modules/Commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.help = new Discord.Collection();
client.modules = new Discord.Collection();

//Music
client.music = new Discord.Collection();
client.music.set("queue",require('modules/music').initQueue());

//Load Commands
fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err);//I fucked up!
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length<=0){console.log("No commands to load!");return;}
	console.log(`Loading ${jsfiles.length} commands!`);
	jsfiles.forEach((f,i) => {
		if((f.match(new RegExp("\\.", "g")) || []).length<=1){
			let props = require(`./commands/${f}`);

			if(props.config.enabled){//IF COMMAND IS ENABLED

				client.commands.set(props.help.name,props);
				client.help.set(props.help.name,props);

				if(f.includes("-.")){ //Has SubCommands
					let subCommands = jsfiles.filter(s => {return s.includes(props.help.name+".");});
					subCommands.forEach((s,i) => {
						let sub = require(`./commands/${s}`);
						client.commands.set(`${props.help.name}.${sub.help.name}`,sub);
						subCommands[i] = `${props.help.name}.${sub.help.name}`;

						if(sub.config.aliases.length > 0){ //Multiple Aliases
							sub.config.aliases.forEach((m,i) => {client.commands.set(`${props.help.name}.${m}`,sub);});}
					});
					props.config.subCommands = subCommands;
				}
				if(props.config.aliases.length > 0){ //Multiple Aliases
					props.config.aliases.forEach((m,i) => {client.commands.set(m,props);});}
			}
		}
	});
});

//Load Modules
fs.readdir("./modules/", (err, files) => {
	if(err) console.error(err);//I fucked up!
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length<=0){console.log("No modules to load!");return;}
	console.log(`Loading ${jsfiles.length} modules!`);
	jsfiles.forEach((f,i) => {
		let props = require(`./modules/${f}`);
		client.modules.set(props.name,props);
	});
});


client.on('ready', () => {
	console.log("ONLINE!!");
	client.user.setGame('HUMAN THINGS');

	//Say online of channels
	client.guilds.forEach((guild,i) => {
		//guild.defaultChannel.send("I is now Onlines!")
		//	 .then(message => client.modules.get("cleaner").addDeleteToPool(message,15));
	});

	//Run Modules
	client.modules.get("cleaner").run(client);
});

client.on('message', async message => {
	//LOG TO CONSOLE
	console.log("[" + message.channel.guild.name + ":" + message.channel.name + "] " + message.author.username + " : " + message.content);

	if(message.author.bot || message.channel.type === 'dm') return;

	//Sort Media
	//client.modules.get("media").mediaSort(client,message);

	//AI
	if(message.content.includes("<@335953109123596289>"))
		client.modules.get("ai").request(client,message);

	//Command Handler
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if(!command.startsWith(prefix)) return;

	let cmd = client.commands.get(command.slice(prefix.length));
	if(cmd) cmd.run(client,message,args);

	//MUSIC MODULE DEBUGGING --- TODO MOVE TO COMMANDS SCRIPTS
	/*const member = message.member;
	const mess = message.content.toLowerCase();
	const argsM = message.content.split(' ').slice(1).join(" ");

	if(mess.startsWith(prefix+"play")){
		if(queue.length > 0 || isPlaying){
			getID(argsM, (id) => {
				add_to_queue(id);
				fetchVideoInfo(id, (err, videoInfo) => {
					if(err) throw new Error(err);
					message.reply(" added to queue **" + videoInfo.title + "**");
				})
			})
		}else{
			isPlaying = true;
			getID(argsM, (id) => {
				queue.push("placeholder");
				playMusic(id, message);
				fetchVideoInfo(id, (err, videoInfo) => {
					if(err) throw new Error(err);
					message.reply(" now playing **" + videoInfo.title + "**");
				})
			})
		}
	}else if(mess.startsWith(prefix+"skip")){
		if(skippers.indexOf(message.author.id) === -1){
			skippers.push(message.author.id);
			skipReq++;
			if(skipReq >= Math.ceil((voiceChannel.members.size - 1)/2)){
				skip_song(message);
				message.reply("Your skip was noticed by senpai. Skipping now...");
			}else{
				message.reply("Your skip was noticed by senpai. You need **"+Math.ceil((voiceChannel.members.size - 1)/2)-skipReq+"** votes");
			}
		}else{
			message.reply("You already voted to skip num nuts");
		}
	}
*/
});
client.login(process.env.TOKEN);