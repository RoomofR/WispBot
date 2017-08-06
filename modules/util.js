module.exports.name = "util";
const request = require('request');
const sharp = require('sharp');
const util = require('modules/util');
const snekfetch = require('snekfetch');
const getYoutubeID = require("get-youtube-id");
const dialog = require("../json/dialog.json");
const youtubeFilters = ["youtube.com","youtu.be",];

module.exports = {

	isInteger: (x) => {return (x | 0) === x;},

	contains: (str,arr) => {return new RegExp(arr.join("|")).test(str.toLowerCase())},

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
		snekfetch.get(`https://i.ytimg.com/vi/${id}/default.jpg`)
			.then(r => {
				sharp(r.body)
				//.resize(480, 270)
				//.resize(140, 79)
				.resize(84, 47)
				.toBuffer((err, data, info) => {
					//return [{attachment: data, name: `${id}.jpg`}];
					return callback(data);
					//msg.channel.send({files:[{attachment: data, name: `${id}.jpg`}]});
				});
			});
	},

	fetchVideoInfo: (id, callback) => {
		let api = `https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(id)}&key=${process.env.YT_APIKEY}`;
		//api+= `&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics`;
		//api+= ` &part=snippet,contentDetails,statistics`;
		api+= `&fields=items(id,snippet(publishedAt,title,channelTitle,channelId),statistics(viewCount))&part=snippet,statistics`;
		request(api, function(err,res,body){
			if(err) console.error(err);
			var json = JSON.parse(body);
			callback(json.items[0]);
			/*{ id: 'GJDUWw94Sig',
			snippet:
			 { publishedAt: '2017-06-27T21:31:56.000Z',
			   channelId: 'UC3ifTl5zKiCAhHIBQYcaTeg',
			   title: 'BUNT. - Folk House Mixtape Chapter 4',
			   channelTitle: 'Proximity' },
			statistics: { viewCount: '196868' } }
			*/
		});
	},

	parseArgstoID: (args, callback) => {
		let id=args[0];
		//Check if youtube url
		if(new RegExp(youtubeFilters.join("|")).test(id.toLowerCase())){
			//console.log("youtube url detected");
			return callback(getYoutubeID(id));
		}else{ //Youtube ID
			//console.log("failed url test");
			request.get(`http://img.youtube.com/vi/${id}/0.jpg`,(err,res) => {
				if(res.statusCode == 200){
					//console.log("youtube id detected");
					return callback(id);
				}else{
					let api = `https://www.googleapis.com/youtube/v3/search?type=video&q=${encodeURIComponent(args.join(" "))}&key=${process.env.YT_APIKEY}`;
					api += "&part=snippet&fields=items(id(videoId),snippet(publishedAt,title,channelTitle,channelId))&maxResults=1";
					request(api, (err,res,body) => {
						//console.log(JSON.parse(body).items.length);
						let i = JSON.parse(body).items[0];
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