module.exports.name = "ai";
const apiai = require('apiai');
const app = apiai(process.env.AI_APIKEY);

const request = require('request');

module.exports.request = async (client,message) => {
	let query = message.content.replace("<@335953109123596289>", "");

	var request = app.textRequest(query, {
		sessionId: message.author.id,
		contexts: [{ name: 'meow' }]
	});

	request.on('response', function(response) {
		message.reply(response.result.fulfillment.speech);
	});

	request.on('error', function(error) {
		console.log(error);
	});

	request.end();
/*	request({
		url: 'https://api.api.ai/v1/',
		access_token: process.env.AI_APIKEY,

	}, (err,res) => {
		console.log(res.body);
	});*/
}