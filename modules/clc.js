const colors = {
	"reset" : "\x1b[0m",
	"Bright" : "\x1b[1m",
	"Dim" : "\x1b[2m",
	"Underscore" : "\x1b[4m",
	"Blink" : "\x1b[5m",
	"Reverse" : "\x1b[7m",
	"Hidden" : "\x1b[8m",

	"black" : "\x1b[30m",
	"red" : "\x1b[31m",
	"green" : "\x1b[32m",
	"yellow" : "\x1b[33m",
	"blue" : "\x1b[34m",
	"magenta" : "\x1b[35m",
	"cyan" : "\x1b[36m",
	"white" : "\x1b[37m",

	"bgBlack" : "\x1b[40m",
	"bgRed" : "\x1b[41m",
	"bgGreen" : "\x1b[42m",
	"bgYellow" : "\x1b[43m",
	"bgBlue" : "\x1b[44m",
	"bgMagenta" : "\x1b[45m",
	"bgCyan" : "\x1b[46m",
	"bgWhite" : "\x1b[47m"
}

module.exports.clear = ()=>{
	for(i in colors)
		colors[i]="";
}

String.prototype.meow = function(test) {
	return(this+test);
};

String.prototype.color = function(color) {
	if(colors.hasOwnProperty(color)){
		return (colors[color]+this).reset();
	}
	else{
		console.error(`ERROR CLC: No color found named: ${color}`.color('red'));
	}
};

String.prototype.bgColor = function(color) {
	color = 'bg'+color.charAt(0).toUpperCase() + color.slice(1);
	if(colors.hasOwnProperty(color))
		return (colors[color]+this).reset();
	else{
		console.error(`ERROR CLC: No bgcolor found named: ${color}`.color('red'));
	}
};

String.prototype.reset = function() {
	return this+colors['reset'];
};

String.prototype.error = function() {
	return this.color('red');
};

String.prototype.warn = function() {
	return this.color('orange');
};