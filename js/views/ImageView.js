var GLOBAL;

var ImageView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	bindings: {
		".enabled": "enabled",
		".xOffset": "xOffset",
		".yOffset": "yOffset",
		".rotation": "rotation",
		".width": "width",
		".shadowEnable": "shadowEnable",
	},
	events: {
		"change .imageFile": "loadFile",
	},
	render: function() {
		this.$el.html( "<label><input type='checkbox' class='enabled' /><span class='title'>" + this.model.get("label") + "</span></label>");
		this.$el.append( "<label><input type='file' class='imageFile' /></label>" );
		this.$el.append( "<label><span>Width:</span> <input type='text' class='width' /></label>" );
		this.$el.append( "<label><span>Horizontal offset:</span> <input type='text' class='xOffset' /></label>" );
		this.$el.append( "<label><span>Vertical offset:</span> <input type='text' class='yOffset' /></label>" );
		this.$el.append( "<label><span>Rotation:</span> <input type='text' class='rotation' /></label>" );
		this.$el.append( "<label><input type='checkbox' class='shadowEnable' />Add shadow</label>");
		
		this.stickit();
	},
	loadFile: function(event) {
		console.log("image loading...");
		
		this.model.set("imageData", new Image());
		this.model.set("imageFileReader", new FileReader());
		
		this.model.get("imageFileReader").onloadend = _.bind(function(ev2) {
			console.log("image loaded!");
			this.model.get("imageData").src = ev2.target.result;
		}, this);
		
		this.model.get("imageFileReader").readAsDataURL(event.target.files[0]);
	}
});