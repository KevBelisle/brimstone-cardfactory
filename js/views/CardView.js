
var GLOBAL;

var CardView = Backbone.View.extend({
	
	initialize: function () {
		this.listenTo(this.model.get("bodyText"), "add remove", this.render);
		this.render();
	},
	
	events: {
		"click #drawCard": "drawCard",
	},
	
	drawCard: function() {
		this.model.drawCard()
	},
	
	render: function() {
	
		this.$el.html("");
		
		var requiredText = this.model.get("requiredText");
		var bodyText = this.model.get("bodyText");
		var bodyTextOptions = this.model.get("bodyTextOptions");
		var toggleableText = this.model.get("toggleableText");
		var toggleableIcons = this.model.get("toggleableIcons");
		var userImages = this.model.get("userImages");
		var backgroundOptions = this.model.get("backgroundOptions");
		
		
		
		this.$el.append("<h2>" + this.model.get("cardType") + "</h2>");
		
		if (Object.keys(requiredText).length > 0) {
			this.$el.append("<div id='requiredText'><h3>Required Text Components</h3><ul></ul></div>");
			_.each(requiredText, this.renderRequiredText, this);
		}
		
		if (bodyTextOptions.length > 0) {
			this.$el.append("<div id='bodyText'><h3>Body Text Components</h3><ul></ul></div>");
			bodyText.each(this.renderBodyText, this);
			bodyTextOptions.each(this.renderBodyTextOptions, this);
		}
		
		if (Object.keys(toggleableText).length > 0) {
			this.$el.append("<div id='toggleableText'><h3>Toggleable Text Components</h3><ul></ul></div>");
			_.each(toggleableText, this.renderToggleableText, this);
		}
		
		if (Object.keys(toggleableIcons).length > 0) {
			this.$el.append("<div id='toggleableIcons'><h3>Toggleable Icons</h3><ul></ul></div>");
			_.each(toggleableIcons, this.renderToggleableIcons, this);
		}
		
		if (Object.keys(userImages).length > 0) {
			this.$el.append("<div id='userImages'><h3>User Image</h3><ul></ul></div>");
			_.each(userImages, this.renderUserImages, this);
		}
		
		if (backgroundOptions.length > 0) {
			this.$el.append("<div id='backgroundOptions'><h3>Background Options</h3><fieldset><ul></ul></fieldset></div>");
			backgroundOptions.each(this.renderBackgroundOptions, this);
		}
		
		this.$el.append('<input type="button" id="drawCard" value="Draw Card">');
		
	},
	
	renderRequiredText: function(text) {
		this.$("#requiredText ul").append(new RequiredTextView({
			tagName: 'li',
			model: text
		}).el);
	},
	
	renderBodyText: function(text) {
		this.$("#bodyText ul").append(new BodyTextView({
			tagName: 'li',
			model: text
		}).el);
	},
	
	renderBodyTextOptions: function(option) {
		this.$("#bodyText").append(new BodyTextOptionView({
			tagName: 'input',
			model: option
		}).el);
	},
	
	renderToggleableText: function(text) {
		this.$("#toggleableText ul").append(new ToggleableTextView({
			tagName: 'li',
			model: text
		}).el);
	},
	
	renderToggleableIcons: function(icon) {
		this.$("#toggleableIcons ul").append(new ToggleableIconView({
			tagName: 'li',
			model: icon
		}).el);
	},
	
	renderUserImages: function(image) {
		this.$("#userImages ul").append(new ImageView({
			tagName: 'li',
			model: image
		}).el);
	},
	
	renderBackgroundOptions: function(backgroundOption) {
		this.$("#backgroundOptions ul").append(new BackgroundOptionView({
			tagName: 'li',
			model: backgroundOption
		}).el);
	}
	
});





