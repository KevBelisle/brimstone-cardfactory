var BackgroundOption = Backbone.Model.extend({
  defaults: {
    label: "",
    img: "",
    enabled: false,
  },

  initialize: function (label, img, enabled) {
    this.set("label", label);
    this.set("img", img);
    this.set("enabled", enabled || this.get("enabled"));
  },
});
