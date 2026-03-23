

var AppView = Backbone.View.extend({
	
	initialize: function () {
		//this.listenTo(this.model.get("bodyText"), "add remove", this.render);
	},
	
	events: {
		//"click #drawCard": "drawCard",
	},
	
	/*drawCard: function() {
		this.model.drawCard()
	},*/
	
	render: function() {
	
		this.$el.html("");
		
		this.$el.append("<div id='cardSelectorWrapper'><div id='cardSelector'></div></div>");
		this.model.get("cardTypes").each(this.renderCardType, this);
		
		this.$el.append("<div id='editor'></div>");
		this.$el.append("<div id='cardWrapper'><canvas id='cardCanvas' width='900' height='1200'></canvas><img id='cardImg' /><p>To save your card: right-click and 'Save image as...'</p></div>");
		
		this.model.get("card")
			.set("context", this.$("canvas#cardCanvas")[0].getContext("2d"))
			.set("outputImg", this.$("img#cardImg"));
		
		if (window.location.protocol == "file:") {
			this.$("canvas#cardCanvas").css("display", "block");
			this.$("img#cardImg").css("display", "none");
		}
		
		this.$("div#editor").append(new CardView({
			tagName: 'div',
			model: this.model.get("card")
		}).el);
		
	},
	
	renderCardType: function (cardType) {		
		this.$("div#cardSelector").append(new CardTypeView({
			tagName: 'a',
			model: cardType
		}).el);
	}
	
});


var CardTypeView = Backbone.View.extend({
	initialize: function() {
		var tmp = this.model.get("model");
		this.label = new tmp().get("cardType");
		this.img = new tmp().get("background");
		this.render();
	},
	events: {
		"click": "changeCardType"
	},
	render: function() {
		this.$el.addClass("changeCardType").append("<img src='" + this.img + "' />" + this.label);
	},
	changeCardType: function() {
		var tmp = this.model.get("model");
		
		this.model.collection.app.unset("card");
		this.model.collection.app.unset("view");
		
		this.model.collection.app.set("card", new tmp);
		this.model.collection.app.set("view", new AppView({
			el: "div#wrapper",
			model: this.model.collection.app
		}));
		
		//console.log(this.model.collection.app.get("card").get("bodyText"));
		
		this.model.collection.app.get("view").render();
	}
});