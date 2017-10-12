(() => {
			var element = (id) => {
				return document.getElementById(id);
			}

			var status = element('status');
			var messages = element('messages');
			var textarea = element('textarea');
			var username = element('username');
			var clear = element('clear');

			var statusDefault = status.textContent;
			var setStatus = (s) => {

				setStatus(s);

				if(s!==statusDefault){
					var delay = setTimeout(() => {
						setStatus(statusDefault);
					},4000);
				}
			}

			//Connect to socket.io
			var socket = io.connect('http://localhost:4200');

			//Check for connection
			if(socket !== undefined){
				console.log('Connected to socket');

				socket.on('output', (data) => {
					console.log(data);
				});

				socket.on('status', (data) => {
					setStatus((typeof data === 'object') ? data.message : data);

					if(data.clear){
						textarea.value = '';
					}
				});

				textarea.addEventListener('keydown', (event) => {
					if(event.which === 13 && event.shiftKey == false){
						//Emit to Server
						socket.emit('input', {
							name:username.value,
							message:textarea.value
						});

						event.preventDefault();
					}
				});
			}

		})();

var setBackgroundColor = (hex) => {
	document.body.style.backgroundColor=hex;
	var color = hexToRgb(hex);
	var a = 1 - (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;

	//document.body.style.backgroundColor = (a < 0.5) ? '#1d1d1d' : '#EEEEEE';
}

var hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}