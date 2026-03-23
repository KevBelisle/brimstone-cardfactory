var ToggleableIconView = Backbone.View.extend({
  initialize: function () {
    this.render();
  },
  bindings: {
    ".enabled": "enabled",
  },
  render: function () {
    this.$el.html(
      "<label><input type='checkbox' class='enabled' />" +
        this.model.get("label") +
        "</label>",
    );
    this.stickit();
  },
});
