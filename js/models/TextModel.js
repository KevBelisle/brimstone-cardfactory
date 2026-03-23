
var Text = Backbone.Model.extend({
	defaults: {
		textBaseline: "alphabetic",
		textAlign: "center",
		
		fillStyle: 'black',
		font: "normal 36px 'Rockwell Condensed'",
		
		strokeStyle: 'transparent',
		lineWidth: 0.35,
		
		shadowColor: "transparent",
		shadowOffsetX: 0,
		shadowOffsetY: 0,
		shadowBlur: 0,
		doubleShadow: false,
		
		multiline: false,
		lineHeight: 40,
		maxWidth: 500,
		
		enabled: true,
		content: "Default content",
		x: 450,
		y: undefined
	},
	
	preDraw: function(context, y) {
		return y;
	},
	
	draw: function(context, y) {
	
		if (this.get("enabled")) {
		
			y = y || this.get("y");
			
			y = this.preDraw(context, y);
			
			context.textBaseline = 	this.get("textBaseline");
			context.textAlign = 	this.get("textAlign");
			
			context.fillStyle = 	this.get("fillStyle");
			context.strokeStyle = 	this.get("strokeStyle");
			context.font = 			this.get("font");
			context.lineWidth =		this.get("lineWidth");
			
			context.shadowColor = 	this.get("shadowColor");
			context.shadowOffsetX = this.get("shadowOffsetX");
			context.shadowOffsetY = this.get("shadowOffsetY");
			context.shadowBlur = 	this.get("shadowBlur");
			
			if (this.get("multiline")) {
				y = this._wrapText(
					context,
					this.get("content"),
					this.get("x"),
					y,
					this.get("maxWidth"),
					this.get("lineHeight")
				);
			}
			else {
				if (this.get("doubleShadow")) {
					context.shadowOffsetX = this.get("shadowOffsetX")-900;
					context.fillText(this.get("content"), this.get("x")+900, y);
					context.shadowOffsetX = this.get("shadowOffsetX");
				}
				
				context.fillText(
					this.get("content"),
					this.get("x"),
					y
				);
				context.strokeText(
					this.get("content"),
					this.get("x"),
					y
				);
				
			}
		}
			
		return y;
		
	},
	
	_wrapText: function(context, text, x, y, maxWidth, lineHeight) {

		//console.log(this.get("font"));
	
		var fragments = _.map(text.split(' '), function(word, key, list){
			var words;
			if (/^\*\*(.+)\*\*/.test(word)) {
				// Word contains ** **
				words = _.map(word.split("**").slice(1,3), function (word, key) {
					if (key == 0) {
						return {word: word, bold: true}
					} else {
						return {word: word, bold: false}
					}
				}, this);
			} else {
				words = [{word: word, bold: false},];
			}
			
			if(word == "$P$") {
				// Peril die!
				
				var fontSize = parseInt(/(\d+)px/.exec(this.get("font"))[1]);
				
				return {
					content: [{word: "$P$", bold: false, size: fontSize},],
					length: fontSize*0.8
				}
			}
		
			var length = _.reduce(words, function(total, word) {
				if (word["bold"]) {
					context.font = this.get("font").replace("normal", "bold");
				} else {
					context.font = this.get("font");
				}
				total += context.measureText(word["word"]).width;
				return total;
			}, 0, this);
		
			return {
				content: words,
				length: length,
			}
		}, this);
		
		console.log(JSON.stringify(fragments));
		
		context.font = this.get("font");
		context.textAlign = "left";
		
		var spaceWidth = context.measureText(" ").width;
		
		while (fragments.length > 0) {
			var lineWordCount = 1;
			while ( _.reduce( fragments.slice(0,lineWordCount+1), function (total, word){return total + word["length"]}, 0) + ((lineWordCount-1) * spaceWidth) < maxWidth && lineWordCount <= fragments.length ) {
				lineWordCount += 1;
			}
			var lineLength = _.reduce( fragments.slice(0,lineWordCount), function (total, word){return total + word["length"]}, 0) + ((lineWordCount-1) * spaceWidth);
			
			var lineX = x - lineLength/2;
			//console.log(x + " - " + lineLength + "/2 = " + lineX);
			
			_.each( fragments.slice(0,lineWordCount), function(fragment) {
				_.each(fragment["content"], function(word) {
					
					if (word["word"] == "$P$") {
						
						console.log(JSON.stringify( [lineX, y, word["size"], word["size"]] ));
						
						var scale = 1.4;
						
						context.drawImage(
							images["img/dice-peril.png"],
							lineX - word["size"]*(scale-1)/2,
							y - word["size"]*(0.7 + (scale-0.7)/2),
							word["size"]*scale,
							word["size"]*scale
						);
						lineX += word["size"];
						
					} else {
					
						if (word["bold"]) {
							context.font = this.get("font").replace("normal", "bold");
						} else {
							context.font = this.get("font");
						}
						context.fillText(word["word"], lineX, y);
						context.strokeText(word["word"], lineX, y);
						lineX += context.measureText(word["word"]).width;
					}
				

				}, this);
				
				lineX += spaceWidth;
			}, this);
			
			fragments.splice(0, lineWordCount);
			y += lineHeight;
		}
		
		return y;
	}
});




var SpacerText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Spacer",
		yOffset: 50,
	}),
	draw: function(context, y) {
		return y + parseInt(this.get("yOffset"));
	}
});




var FlourishText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Flourish",
		img: "",
		yOffset: 0,
	}),
	draw: function(context, y) {
		context.drawImage(images[this.get("img")], 450-170, y+this.get("yOffset"));
		return y + 84;
	}
});
var TopFlourishText = FlourishText.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Flourish Top",
		img: "img/text-flourish-top.png",
		yOffset: -10,
	}),
});
var BottomFlourishText = FlourishText.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Flourish Bottom",
		img: "img/text-flourish-bottom.png",
		yOffset: -50,
	}),
});





var TitleText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Title",
	
		fillStyle: 'white',
		font: "bold small-caps 72px 'Rockwell Condensed'",
		
		shadowColor: "black",
		shadowBlur: 20,
		doubleShadow: true,
		
		content: "Card Title",
	}),
});

var BountyTitleText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Title",
	
		fillStyle: 'black',
		font: "normal 80px 'dust west'",
		
		shadowColor: "transparent",
		
		content: "Bounty Title",
	}),
});

var KeywordsText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Keywords",
	
		fillStyle: 'white',
		font: "normal 36px 'Rockwell Condensed'",
		
		shadowColor: "black",
		shadowBlur: 10,
		doubleShadow: true,
		
		content: "Keyword - Keyword",
	}),
	preDraw: function (context, y) {
		//this.set("content", this.get("content").replace(/ - /g, " ⬩ "));
		return y;
	}
});

var PriceText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Price",
	
		fillStyle: 'black',
		font: "bold 36px 'Rockwell Condensed'",
		
		content: "$8,000",
	}),
});

var ClassRestrictionText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Class Restriction",
	
		textBaseline: "alphabetic",
		fillStyle: 'white',
		font: "bold small-caps 60px 'Rockwell Condensed'",
		
		lineHeight: 42,
		maxWidth: 500,
		
		content: "Humans Only",
	}),
	preDraw: function(context, y) {
		
		context.font = "bold small-caps 60px 'Rockwell Condensed'";
		var metrics = context.measureText(this.get("content"));
		var testWidth = metrics.width;
		
		if (testWidth > 540) {
		
			context.font = "bold small-caps 46px 'Rockwell Condensed'";
			var metrics = context.measureText(this.get("content"));
			var testWidth = metrics.width;
		
			if (testWidth > 540) {
				context.drawImage(images["img/classRestrictionHighlight-Multiline.png"], 450-302, y-82);
				this.set("multiline", true);
				this.set("font", "bold small-caps 46px 'Rockwell Condensed'");
				y -= 32;
			} else {
				context.drawImage(images["img/classRestrictionHighlight.png"], 450-302, y-68);
				this.set("multiline", false);
				this.set("font", "bold small-caps 46px 'Rockwell Condensed'");
				y -= 8;
			}
		
		} else {
			context.drawImage(images["img/classRestrictionHighlight.png"], 450-302, y-68);
			this.set("multiline", false);
			this.set("font", "bold small-caps 60px 'Rockwell Condensed'");
		}
		
		return y;
	}
});

var OtherRestrictionText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Other Restriction",
	
		textBaseline: "alphabetic",
		fillStyle: '#870a05',
		font: "bold small-caps 42px 'Rockwell Condensed'",
		
		shadowColor: "white",
		shadowBlur: 5,
		
		content: "Discard this Card",
	})
});





var MultilineText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		textBaseline: "alphabetic",
		
		multiline: true,
		lineHeight: 40,
		maxWidth: 500
	}),
});





var FluffText = MultilineText.extend({
	defaults: _.extend({},MultilineText.prototype.defaults, {
		label: "Fluff Text",
	
		font: "italic 36px 'Berylium'",
		fillStyle: 'black',
		strokeStyle: 'black',
		
		content: "Fluffy fluff text is fun for everyone.",
	}),
});

var CardText = MultilineText.extend({
	defaults: _.extend({},MultilineText.prototype.defaults, {
		label: "Card Text",
	
		font: "normal 42px 'Berylium'",
		fillStyle: 'black',
		strokeStyle: 'black',
		
		content: "This card does some **seriously** crazy **stuff**.",
	}),
});

var StatChangeText = MultilineText.extend({
	defaults: _.extend({},MultilineText.prototype.defaults, {
		label: "Stat Change",
	
		font: "bold small-caps 46px 'Rockwell Condensed'",
		fillStyle: 'black',
		
		content: "+10 Everything",
	}),
	preDraw: function(context, y) {
		y += 10;
		
		context.shadowColor = "transparent";
		context.drawImage(images["img/statHighlight.png"], 450-210, y-44);
		
		return y;
	}
});




var Coin = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Coin",
		content: "$125",
		
		font: "bold 60px 'Rockwell Condensed'",
		fillStyle: 'white',
		
		shadowColor: "#451f00",
		shadowBlur: 10,
		doubleShadow: true
	}),
	preDraw: function(context, y) {
		console.log("COIN PREDRAW");
		context.shadowColor = "transparent";
		context.drawImage(images["img/icon-coin.png"], this.get("x")-90, y-120);
		context.shadowColor = 	this.get("shadowColor");
		return y;
	}
});



var Dice = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		enabled: false,
		y: 1000,
		
		font: "bold 100px 'Berylium'",
		fillStyle: 'white',
		
		shadowColor: "black",
		shadowBlur: 10,
		doubleShadow: true
	})
});

var Dice2D6 = Dice.extend({
	defaults: _.extend({},Dice.prototype.defaults, {
		label: "2D6",
		content: "12",
	}),
	draw: function(context, y) {
		y = y || this.get("y");
		
		if (this.get("enabled")) {
		
			context.shadowColor = "transparent";
			context.drawImage(images[this.get("image")], 450-190, y-140);
			
			context.textBaseline = 	this.get("textBaseline");
			context.textAlign = 	this.get("textAlign");
			
			context.fillStyle = 	this.get("fillStyle");
			context.font = 			this.get("font");
			
			context.shadowColor = 	this.get("shadowColor");
			context.shadowOffsetX = this.get("shadowOffsetX");
			context.shadowOffsetY = this.get("shadowOffsetY");
			context.shadowBlur = 	this.get("shadowBlur");
			
			if (this.get("doubleShadow")) {
				context.shadowOffsetX = this.get("shadowOffsetX")-900;
				context.fillText(
					this.get("content"),
					this.get("x")+120+900,
					y
				);
				context.shadowOffsetX = this.get("shadowOffsetX");
			}
			
			context.fillText(
				this.get("content"),
				this.get("x")+120,
				y
			);
		}
			
		return y;
	}
});

var DiceD36 = Dice.extend({
	defaults: _.extend({},Dice.prototype.defaults, {
		label: "D36",
		content: "6,6",
	}),
	draw: function(context, y) {
		y = y || this.get("y");
			
		if (this.get("enabled")) {
		
			context.shadowColor = "transparent";
			context.drawImage(images[this.get("image")], 450-154, y-125);
			
			context.textBaseline = 	this.get("textBaseline");
			context.textAlign = 	this.get("textAlign");
			
			context.fillStyle = 	this.get("fillStyle");
			context.font = 			this.get("font");
			
			context.shadowColor = 	this.get("shadowColor");
			context.shadowOffsetX = this.get("shadowOffsetX");
			context.shadowOffsetY = this.get("shadowOffsetY");
			context.shadowBlur = 	this.get("shadowBlur");
			
			var diceResults = this.get("content").split(",")
			
			
			
			if (this.get("doubleShadow")) {
				context.shadowOffsetX = this.get("shadowOffsetX")-900;
				
				context.fillText(
					diceResults[0],
					this.get("x")-70+900,
					y
				);
				context.fillText(
					diceResults[1],
					this.get("x")+70+900,
					y
				);
				
				context.shadowOffsetX = this.get("shadowOffsetX");
			}
			
			context.fillText(
				diceResults[0],
				this.get("x")-70,
				y
			);
			context.fillText(
				diceResults[1],
				this.get("x")+70,
				y
			);
		}
			
		return y;
	}
});




var Dice2D6Green = Dice2D6.extend({
	defaults: _.extend({},Dice2D6.prototype.defaults, {
		label: "Green 2D6",
		image: "img/dice-2d6-green.png"
	})
});
var Dice2D6Blue = Dice2D6.extend({
	defaults: _.extend({},Dice2D6.prototype.defaults, {
		label: "Blue 2D6",
		image: "img/dice-2d6-blue.png"
	})
});
var Dice2D6Orange = Dice2D6.extend({
	defaults: _.extend({},Dice2D6.prototype.defaults, {
		label: "Orange 2D6",
		image: "img/dice-2d6-orange.png"
	})
});

var DiceD36Green = DiceD36.extend({
	defaults: _.extend({},DiceD36.prototype.defaults, {
		label: "Green D36",
		image: "img/dice-d36-green.png"
	})
});
var DiceD36Blue = DiceD36.extend({
	defaults: _.extend({},DiceD36.prototype.defaults, {
		label: "Blue D36",
		image: "img/dice-d36-blue.png"
	})
});
var DiceD36Orange = DiceD36.extend({
	defaults: _.extend({},DiceD36.prototype.defaults, {
		label: "Orange D36",
		image: "img/dice-d36-orange.png"
	})
});





var BevelTitleText = Text.extend({
	defaults: _.extend({},Text.prototype.defaults, {
		label: "Title",
	
		fillStyle: 'white',
		font: "bold small-caps 60px 'Berylium'",
		
		shadow1Color: "rgba(0,0,0,0.5)",
		shadow1OffsetX: -3,
		shadow1OffsetY: -3,
		shadow1Blur: 5,
		
		shadow2Color: "rgba(255,255,255,0.5)",
		shadow2OffsetX: 3,
		shadow2OffsetY: 3,
		shadow2Blur: 5,
		
		content: "Card Title",
	}),
	
	
	draw: function(context, y) {
	
		if (this.get("enabled")) {
		
			y = y || this.get("y");
			
			y = this.preDraw(context, y);
			
			context.textBaseline = 	this.get("textBaseline");
			context.textAlign = 	this.get("textAlign");
			
			context.fillStyle = 	this.get("fillStyle");
			context.font = 			this.get("font");
			
			context.shadowColor = 	this.get("shadow1Color");
			context.shadowOffsetX = this.get("shadow1OffsetX") - 900;
			context.shadowOffsetY = this.get("shadow1OffsetY");
			context.shadowBlur = 	this.get("shadow1Blur");
			context.fillText(this.get("content"), this.get("x")+900, y);
			
			context.shadowColor = 	this.get("shadow2Color");
			context.shadowOffsetX = this.get("shadow2OffsetX") - 900;
			context.shadowOffsetY = this.get("shadow2OffsetY");
			context.shadowBlur = 	this.get("shadow2Blur");
			context.fillText(this.get("content"), this.get("x")+900, y);
			
			context.shadowColor = 	"transparent";
			context.fillText(
				this.get("content"),
				this.get("x"),
				y
			);
				
		}
			
		return y;
		
	},
});
