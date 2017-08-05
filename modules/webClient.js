module.exports.name = "webClient";
const express = require('express');
const app = express();
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

module.exports.run = () =>{
	app.set('port', (process.env.PORT || 5000));
	app.use(express.static(__dirname+'/views/assets'));
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	//ROUTERS
	app.get('/', (req,res) => {
		res.render('pages/index');
	});

	app.get('*', function(req, res){
	  res.render('pages/error');
	});

	

	io.on('connection', (socket) => {
		let chat = ['meow','meow'];

		//Status
		sendStatus = (s) => {
			socket.emit('status',s);
		}

		socket.emit('output','meow');

		socket.on('input', (data) => {
			let name = data.name;
			let message = data.message;
			console.log(`[${name}] : ${message}`);
		});

	});

	app.listen(app.get('port'), () => {
		console.log('Web Client App Online!');
	});

	server.listen(4200);
}