/*module.exports.name = "util";
const request = require('request');
const sharp = require('sharp');
const util = require('modules/util');
const snekfetch = require('snekfetch');
const getYoutubeID = require("get-youtube-id");
const dialog = require("../json/dialog.json");
const youtubeFilters = ["youtube.com","youtu.be",];

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YT_APIKEY);*/

String.prototype.matches = function(arr) {return new RegExp(arr.join("|")).test(this)}

String.prototype.makeId = function(len) {
	var text = "",possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

Number.prototype.isInteger = function() {return (this | 0) === this}

module.exports = {

	meow: () => {
		console.log("MEOW");
	},

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

	matches: (arr,str) => {
		return new RegExp(arr.join("|")).test(str);
	},

	compareKeys: (a, b) => {
  		let aKeys = Object.keys(a).sort();
  		let bKeys = Object.keys(b).sort();
  		return JSON.stringify(aKeys) === JSON.stringify(bKeys);
	}
/*
	cropThumbnail: (id, callback) => {
		snekfetch.get(`https://img.youtube.com/vi/${id}/0.jpg`)
			.then(r => {
				sharp(r.body)
				//.resize(480, 270)
				.resize(140, 79)
				.toBuffer((err, data, info) => {
					//return [{attachment: data, name: `${id}.jpg`}];
					return callback(data);
					//msg.channel.send({files:[{attachment: data, name: `${id}.jpg`}]});
				});
			});
	},

	parseArgstoID: (args, callback) => {
		let id=args[0];
		//Check if youtube url
		if(new RegExp(youtubeFilters.join("|")).test(id)){
			//console.log("youtube url detected");
			return callback(getYoutubeID(id));
		}else{ //Youtube ID
			//console.log("failed url test");
			request.get(`http://img.youtube.com/vi/${id}/0.jpg`,(err,res) => {
				if(res.statusCode == 200){
					//console.log("youtube id detected");
					return callback(id);
				}else{
					request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q="+encodeURIComponent(args.join(" "))+"&key="+process.env.YT_APIKEY, (err,res,body) => {
						let i = JSON.parse(body).items[0].id.videoId;
						if(i){
							//console.log("youtube query detected");
							return callback(i);
						}else{
							//console.log("No youtube video detected");
							return callback(null);
						}
					});
				}
			})
		}
	}*/
}