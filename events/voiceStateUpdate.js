exports.run = async (client,oldUser,newUser) => {
	let oldVC = oldUser.voiceChannel ? oldUser.voiceChannel.name : "None";
	let newVC = newUser.voiceChannel ? newUser.voiceChannel.name : "None";
	console.log(`${oldVC} --> ${newVC}`);
}