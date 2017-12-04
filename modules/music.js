module.exports = function(client) {
	var module = {};
	module.client=client,
	module.distpatchers,
	module.voiceConnections={};

	module.client.guilds.array().forEach(guild => {
		if(typeof guild.me.voiceChannel != 'undefined'){
			guild.me.voiceChannel.join().then(_ => {
				guild.me.voiceChannel.leave();
			})
			.catch(err => {console.error(err)});
			
		}
	})

	//Gets VoiceConnection
	module.getVoiceConnection = (guild) => {
		return module.voiceConnections[guild.id]
	}
	//Gets VoiceChannel
	module.getVoiceChannel = (guild) => {
		return module.voiceConnections[guild.id].channel
	}

	//Joins to voice channel
	module.join = (guild,channel,callback) => {
		channel.join()
			.then(connection => {
				module.voiceConnections[guild.id]=connection;
				return callback(channel);
			})
			.catch(err => {return callback(err)});
	}

	//Leaves voice channel
	module.leave = (guild,callback) => {
		let vc = module.voiceConnections[guild.id].channel;
		module.voiceConnections[guild.id].disconnect();
		module.voiceConnections[guild.id]==null;
		return callback(vc);
	}

	return module;
}