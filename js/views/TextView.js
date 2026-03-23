

var RequiredTextView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	bindings: {
		"input": "content"
	},
	render: function() {
		this.$el.html( "<label><span class='title'>" + this.model.get("label") + ":</span><input type='text' value='" + this.model.get("content") + "'></label>" );
		this.stickit();
	},
});


var BodyTextView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	bindings: {
		".content": "content",
		".yOffset": "yOffset",
	},
	events: {
		"click a.remove": "removeItem"
	},
	render: function() {
	
		if (this.model.get("label") == "Spacer") {
			this.$el.html( "<label><span class='title'>" + this.model.get("label") + ":</span><a class='remove'>X</a><input type='text' class='yOffset' value='" + this.model.get("yOffset") + "'></label>" );
		}
		else if (this.model.get("multiline")) {
			this.$el.html( "<label><span class='title'>" + this.model.get("label") + ":</span><a class='remove'>X</a><textarea class='content'>" + this.model.get("content") + "</textarea></label>" );
		}
		else {
			this.$el.html( "<label><span class='title'>" + this.model.get("label") + ":</span><a class='remove'>X</a><input type='text' class='content' value='" + this.model.get("content") + "'></label>" );
		}
		this.stickit();
	},
	removeItem: function() {
		this.model.collection.remove(this.model);
	}
});


var BodyTextOptionView = Backbone.View.extend({
	initialize: function() {
		var tmp = this.model.get("model");
		this.label = new tmp().get("label");
		this.render();
	},
	events: {
		"click": "addItem"
	},
	render: function() {
		this.$el.attr('type', 'button').addClass("addText").val("Add " + this.label);
	},
	addItem: function() {
		var tmp = this.model.get("model");
		this.model.collection.addTo.add(new tmp());
	}
});


var ToggleableTextView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	bindings: {
		".content": "content",
		'.enabled': "enabled"
	},
	render: function() {
		if (this.model.get("multiline")) {
			this.$el.html( "<label><input type='checkbox' class='enabled' /><span class='title'>" + this.model.get("label") + ":</span></label><textarea class='content'>" + this.model.get("content") + "</textarea>" );
		}
		else {
			this.$el.html( "<label><input type='checkbox' class='enabled' /><span class='title'>" + this.model.get("label") + ":</span></label><input type='text' class='content' value='" + this.model.get("content") + "'>" );
		}
		this.stickit();
	},
	removeItem: function() {
		this.model.collection.remove(this.model);
	}
});