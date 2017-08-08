module.exports.name = "util";
const request = require('request');
const sharp = require('sharp');
const snekfetch = require('snekfetch');
const Jimp = require("jimp");
const dialog = require("../json/dialog.json");
const youtubeFilters = ["youtube.com","youtu.be"];

const mongodb = require('mongodb');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = `mongodb://wispbot:${process.env.KEY}@ds131583.mlab.com:31583/wispdb`;

module.exports = {
	isInteger:isInteger,
	contains:contains,
	roulette:roulette,
	cropThumbnail:cropThumbnail,
	fetchVideoInfo:fetchVideoInfo,
	fetchPlaylistInfo:fetchPlaylistInfo,
	parseArgstoID:parseArgstoID,
	parseUri:parseUri,
	splitString:splitString,
	captionQuoteImage:captionQuoteImage,
	makeid:makeid,
	indexShuffle:indexShuffle
}

function isInteger(x) {return (x | 0) === x;}

function contains (str,arr) {return new RegExp(arr.join("|")).test(str.toLowerCase())}

function roulette (dialogID) {
	let roulette = [];
	let data = dialog[dialogID];
	data.forEach((v) => {
		for (var i = v.freq; i >= 0; i--) {
			roulette.push(v.str);
		}
	});
	return roulette[Math.floor(Math.random()*roulette.length)];
}

function cropThumbnail(id, callback){
	snekfetch.get(`https://i.ytimg.com/vi/${id}/default.jpg`)
		.then(r => {
			sharp(r.body)
			//.resize(480, 270)
			//.resize(140, 79)
			.resize(84, 47)
			.toBuffer((err, data, info) => {
				return callback(data);
			});
	});
}

function fetchVideoInfo(id, callback){
	request({
		method: 'GET',
		uri: 'https://www.googleapis.com/youtube/v3/videos',
		qs:{
			id: id,
			key: process.env.YT_APIKEY,
			fields: 'items(id,snippet(title,channelTitle))',
			part: 'id,snippet'
		}
	},(err,res,body) => {
		if(err) console.error(err);
		var json = JSON.parse(body);
		callback(json.items[0]);
	});
}

//fetchPlaylistInfo('PLoVt_E2Bf75HnPfpj7SiJSr_rNP8lPzCA', ()=>{});

function fetchPlaylistInfo(id,call){
	
	const parsePlaylistDataToIds = (data) => {
		ids=[];
		data.items.forEach((i) => {ids.push({
			"title":i.snippet.title,
			"id":i.snippet.resourceId.videoId
		});});
		return ids;
	};

	const getPageIds = (playlistID,page,callback) => {
		request({
			method: 'GET',
			uri: 'https://www.googleapis.com/youtube/v3/playlistItems',
			qs:{
				playlistId: playlistID,
				key: process.env.YT_APIKEY,
				maxResults:50,
				pageToken:page,
				fields: 'pageInfo(totalResults),nextPageToken,items(snippet(resourceId(videoId),title))',
				part: 'snippet'
			}
		},(err,res,body) => {
			if(err) {return console.error(err)};
			var json = JSON.parse(body);
			return callback(parsePlaylistDataToIds(json),json.nextPageToken,json.pageInfo.totalResults);
		});
	};

	var numOfIds = Infinity;
	var playlistIds = [];
	var pageToken;
	const getPlaylistIds = (playlistId,callback ) => {
		getPageIds(id,pageToken,(ids,token,total) => {
			numOfIds=total;
			pageToken=token;
			playlistIds = playlistIds.concat(ids);
			if(playlistIds.length < numOfIds)
				getPlaylistIds(playlistId, (p,call) => {return callback(p,call)});
			else
				return callback(playlistIds, null);
		});
	}
	getPlaylistIds(id,(ids) => {
		console.log(`[MUSIC] Found ${ids.length} songs in playlist: ${id}`);
		return call(ids);
	});
}

function parseArgstoID(args, callback){
	let id=args.join(" ");
	console.log("")
	//Check if youtube url
	if(new RegExp(youtubeFilters.join("|")).test(id.toLowerCase())){
		let query = parseUri(id).queryKey;
		if(query.v){
			fetchVideoInfo(query.v,(i)=>{
				return callback({
					id:i.id,
					title:i.snippet.title
				});
			});
		}
		else if(query.list){
			fetchPlaylistInfo(query.list, (ids => {return callback(ids);}));
		}
		else return callback(null);
		
	}else{ //Youtube ID
		//console.log("failed url test");
		request.get(`http://img.youtube.com/vi/${id}/0.jpg`,(err,res) => {
			if(res.statusCode == 200){
				//console.log("youtube id detected");
				fetchVideoInfo(id,(i)=>{
					return callback({
						id:i.id,
						title:i.snippet.title
					});
				});
			}else if(id.length==34){
				fetchPlaylistInfo(id, (ids => {return callback(ids);}));
			}else{
				request({
					method: 'GET',
					uri: 'https://www.googleapis.com/youtube/v3/search',
					qs:{
						type: 'video',
						q:args.join(" "),
						key: process.env.YT_APIKEY,
						maxResults:1,
						fields: 'items(id(videoId),snippet(title))',
						part: 'snippet'
					}
				},(err,res,body) => {
					//console.log(JSON.parse(body).items[0]);
					let i = JSON.parse(body).items[0];
					if(i){
						//console.log("youtube query detected");
						return callback({
							id:i.id.videoId,
							title:i.snippet.title
						});
					}else{
						//console.log("No youtube video detected");
						return callback(null);
					}
				});
			}
		});
	}
}

function parseUri (str) {
	var	o   = {
		strictMode: false,
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	},
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	if(str.includes('youtu.be'))
		uri.queryKey.v = str.split('/')[3];

	return uri;
}

function splitString(str) {
	//var char = 21;
	var char = 42;
	var len = str.length;
	var lines = [];
	var start = 0;
	var end = 0;

	while(end < len-1){
		end+=char-1;
		origEnd=end;

		if(end>=len){
			end=len;
		}else{
			while(str.charAt(end) != " "){
				end--;

				if(end <= start){
					end = origEnd;
					break;
				}
					
			}
		}
		lines.push(str.substring(start,end));
		start=end;
	}
	return lines;
}

function captionQuoteImage(img,caption,callback) {
	Jimp.read(img)
		.then(function (image) {
		    loadedImage = image;
		    return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
		})
		.then(function (font) {

			let height = 10;
			splitString(caption).forEach((line) => {
				loadedImage.print(font, 5, height, line);
				height+=32;
			});

		    //loadedImage.write('output.jpg');
		    loadedImage.getBuffer(Jimp.MIME_PNG,(err,data) => {
		    	callback(data);
		    });
		})
		.catch(function (err) {
		    console.error(err);
		});
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function indexShuffle(len){
	let index = [...Array(len).keys()];
	var m = index.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = index[m];
		index[m] = index[i];
		index[i] = t;
	}
	return index;
}