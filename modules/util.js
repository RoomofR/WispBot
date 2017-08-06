module.exports.name = "util";
const request = require('request');
const sharp = require('sharp');
const util = require('modules/util');
const snekfetch = require('snekfetch');
const getYoutubeID = require("get-youtube-id");
const dialog = require("../json/dialog.json");
const youtubeFilters = ["youtube.com","youtu.be",];

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

	cropThumbnail: (id, callback) => {
		snekfetch.get(`https://img.youtube.com/vi/${id}/0.jpg`)
			.then(r => {
				sharp(r.body)
				.resize(480, 270)
				.toBuffer((err, data, info) => {
					//return [{attachment: data, name: `${id}.jpg`}];
					return callback(data);
					//msg.channel.send({files:[{attachment: data, name: `${id}.jpg`}]});
				});
			});
	},

	//#################################
	//DEPRECATED=======================
	isYoutubeURL: (str) => {
		return new RegExp(youtubeFilters.join("|")).test(str);
	},
	//=================================
	//#################################
	//DEPRECATED=======================
	isYoutubeID: (id,callback) => {
		request.get(`http://img.youtube.com/vi/${id}/0.jpg`,(err,res) => {
			if(res.statusCode == 404)return callback(false);
			else return callback(true);
		});
	},
	//=================================
	//#################################
	//DEPRECATED=======================
	search_video: (query, callback) => {
		request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q="+encodeURIComponent(query)+"&key="+process.env.YT_APIKEY, function(err,res,body){
			var json = JSON.parse(body);
			callback(json.items[0].id.videoId);
		});
	},
	//=================================
	//#################################
	//DEPRECATED=======================
	getYoutubeID: (url, callback) => {
		return callback(getYoutubeID(url));
	},
	//=================================
	//#################################

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
	}
}