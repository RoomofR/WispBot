module.exports = function(client) {
	var module = {};
	module.client=client,
	module.distpatchers={},
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

	//Plays from ytID
	module.play = (guild,callback) => {
		//TODO
	}

	//Plays from ytID
	module.stop = (guild,callback) => {
		//TODO
	}

	//Pauses song
	module.pause = (guild,callback) => {
		//TODO
	}

	//Resume song
	module.resume = (guild,callback) => {
		//TODO
	}

	//Skip current song to next in queue
	module.skip = (guild,callback) => {
		//TODO
	}

	//Sets volume
	module.setVolume = (guild,callback) => {
		//TODO
	}

	//Gets volume
	module.getVolume = (guild,callback) => {
		//TODO
	}

	//Lists queue
	module.list = (guild,callback) => {
		//TODO
	}

	//Clears entire queue
	module.clear = (guild,callback) => {
		//TODO
	}

	//Shuffles entire queue
	module.shuffle = (guild,callback) => {
		//TODO
	}

	//Removes a song from queue
	module.remove = (guild,callback) => {
		//TODO
	}

	return module;
}