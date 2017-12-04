module.exports = function(client) {
	var module = {};
	module.client=client,
	module.distpatcher=null,
	module.voiceChannel=null;

	//Join to voice channel
	module.join = (channel,callback) => {
		channel.join()
			.then(connection => {
				voiceChannel=channel;
				return callback(channel);
			})
			.catch(err => {return callback(err)});
	}

	return module;
}		