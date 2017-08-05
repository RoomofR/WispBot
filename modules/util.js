module.exports.name = "util";
const snekfetch = require('snekfetch');
const sharp = require('sharp');
const dialog = require("../json/dialog.json");

module.exports = {

	roulette: (dialogID) => {
		let roulette = [];
		let data = dialog[dialogID];
		data.forEach((v) => {
			for (var i = v.freq; i >= 0; i--) {
				roulette.push(v.str);
			}
		});
		return roulette[Math.floor(Math.random()*roulette.length)];
	},

	cropThumbnail: (id) => {
		snekfetch.get(`https://img.youtube.com/vi/${id}/0.jpg`)
			.then(r => {
				sharp(r.body)
				.resize(480, 270)
				.toBuffer((err, data, info) => {
					return [{attachment: data, name: `${id}.jpg`}];
					//msg.channel.send({files:[{attachment: data, name: `${id}.jpg`}]});
				});
			});
	}
}