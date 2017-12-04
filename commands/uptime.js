module.exports = {
	enabled: true,
	name: "uptime",
	aliases: ["up"],
	users: [],
	description: "Returns total time online.",
	usage: "/uptime",
	run: run
}

async function run(client,message,args){
	message.reply(`Time since last incident: \`\`\`${msToTime(client.uptime)}\`\`\``);
}

function msToTime(duration) {
	var milliseconds = parseInt((duration%1000)/100)
		, seconds = parseInt((duration/1000)%60)
		, minutes = parseInt((duration/(1000*60))%60)
		, hours = parseInt((duration/(1000*60*60))%24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}