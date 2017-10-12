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
	indexShuffle:indexShuffle,
	parseISO:parseISO,
	parseMS:parseMS
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
	console.log("[Util] Fetching video info: "+id);
	request({
		method: 'GET',
		uri: 'https://www.googleapis.com/youtube/v3/videos',
		qs:{
			id: id,
			key: process.env.YT_APIKEY,
			fields: 'items(id,snippet(title,channelTitle),contentDetails(duration))',
			part: 'id,snippet,contentDetails'
		}
	},(err,res,body) => {
		if(err) console.error(err);
		var videoData = JSON.parse(body).items[0];
		if(!videoData){
			console.log("[Util] Music fetch video info failed! "+id);
			return callback(null);
		}
		console.log(videoData.contentDetails.duration);
		return callback({
			id:videoData.id,
			title:videoData.snippet.title,
			channelTitle:videoData.snippet.channelTitle,
			duration:videoData.contentDetails.duration
		});

	});
}

function fetchPlaylistInfo(id,call){
	console.log("[Util] Fetching playlist info: "+id);

	const parsePlaylistDataToIds = (data) => {
		ids=[];
		data.items.forEach(i=>{ids.push({
			"title":i.snippet.title,
			"id":i.snippet.resourceId.videoId
			})
		});
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
			if(json.error) return callback(null);
			return callback(parsePlaylistDataToIds(json),json.nextPageToken,json.pageInfo.totalResults);
		});
	};

	var numOfIds = Infinity;
	var playlistIds = [];
	var pageToken;
	const getPlaylistIds = (playlistId,callback ) => {
		getPageIds(id,pageToken,(ids,token,total) => {
			if(ids==null) return callback(null);
			numOfIds=total;
			pageToken=token;
			playlistIds = playlistIds.concat(ids);
			if(playlistIds.length < numOfIds) getPlaylistIds(playlistId, (p,call) => {return callback(p,call)});
			else return callback(playlistIds, null);
		});
	}

	getPlaylistIds(id,(ids) => {
		if(ids==null){
			console.log("[Util] Music fetch playlist info failed! "+id);
			return call(null);
		}
		console.log(`[MUSIC] Found ${ids.length} songs in playlist: ${id}`);
		return call(ids);
	});
}

function parseArgstoID(args, callback){
	let id=args.join(" ");
	//Check if youtube url
	if(new RegExp(youtubeFilters.join("|")).test(id.toLowerCase())){
		let query = parseUri(id).queryKey;
		if(query.v) fetchVideoInfo(query.v,data=>{return callback(data)});
		else if(query.list) fetchPlaylistInfo(query.list,datas=>{return callback(datas)});
		else return callback(null);	
	}else if(id.length==34){ //Playlist id
		fetchPlaylistInfo(id,datas=>{return callback(datas)});
	}else if(id.length==11){ //Video id
		fetchVideoInfo(id,data=>{return callback(data)});
	}else{
		console.log("searching");
		request({
			method: 'GET',
			uri: 'https://www.googleapis.com/youtube/v3/search',
			qs:{
				type: 'video',
				q:args.join(" "),
				key: process.env.YT_APIKEY,
				maxResults:1,
				fields: 'items(id(videoId),snippet(title,channelTitle))',
				part: 'snippet'
			}
		},(err,res,body) => {
			let data = JSON.parse(body).items[0];
			if(!data) return callback(null);
			return callback({
				id:data.id.videoId,
				title:data.snippet.title,
				channelTitle:data.snippet.channelTitle
			});
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
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 3; i++)
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

function parseISO(str){
	let time = [];

	str.match(/[0-9]+/g).forEach(t=>{
		time.push(`${(t<10)?"0":""}${t}`);
	});
	return time.join(":");
}

function parseMS(ms){
	let time = [];

	let hours = parseInt((ms/(1000*60*60))%24);
	(hours>0)?time.push(hours):null;

	let minutes = parseInt((ms/(1000*60))%60);
	(minutes>0)?time.push(`${(minutes<10)?"0":""}${minutes}`):time.push("00");

	let seconds = parseInt((ms/1000)%60);
	(seconds>0)?time.push(`${(seconds<10)?"0":""}${seconds}`):time.push("00");

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return time.join(":");
}