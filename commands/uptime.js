module.exports.run = async (client,message,args) => {
	console.log("Uptime!");
	message.reply(msToTime(client.uptime));
}

module.exports.help = {
	name: "uptime",
  description: "Returns total time online.",
  usage: "/uptime"
}

module.exports.config = {
  enabled: true,
  aliases: ["up"]
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    if(hours>0) return hours+` tortuous hour${(hours>1)?"s":""} of existence.`;
   	else if(minutes>0) return minutes+` minute${(minutes>1)?"s":""} of hell.`;
   	else return seconds+` grueling second${(seconds>1)?"s":""} of existence.`;
}