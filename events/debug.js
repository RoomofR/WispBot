exports.run = async (client,info) => {
	if(info.includes("connection")) return;
	console.log(`DISCORD [Debug]: ${info}`);
}