module.exports.name = "media";
const request  = require('request');
const https     = require('https');
const http     = require('http');
const fileType = require('file-type');
const mediaFilter = require('../json/mediaFilters.json');

module.exports.mediaSort = (client,message) => {
	console.log(SplitURL(message.content));
	if(message.attachments.array().length > 0){
		message.attachments.array().forEach((media,i) => {
			message.react("\📷");

			let attachment={
				fname:null,
				fileType:null,
				url:null};
		});
	}
	else{
		let urls = SplitURL(message.content);

		if(urls.length>0){
			urls.forEach((url,i) => {
				url.includes('https://') ? https : http
			    .get(url, res => {
					res.once('data', chunk => {
						res.destroy();
						let media = fileType(chunk);
						console.log(media.mime);
					});
				});
			})
		}

		/*message.react("\📎");
		sort(client,message,{
			fname:null,
			fileType:null,
			url:null});*/
	}
}

function sort(client,message,media){
	console.log("MEDIA DETECTED!");
	
	/*download(media.url, tempFile , function(){

	});*/
	//GET TYPE
	//TODO

	//SORT MEDIA
	//TODO
}

function SplitURL(str) {
	return str.trim().split(/\s+/g).filter((url) => {
		return new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/gi)
						.test(url);
	});
}

//Download Handler
/*var download = function(uri, filename, callback){request.head(uri, function(err, res, body){
try{request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);}catch(err){console.error("COULD NOT DOWNLOAD!");}});};
*/