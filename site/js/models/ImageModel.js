var UserImage = Backbone.Model.extend({
  defaults: {
    x: undefined,
    y: undefined,
    enabled: false,
    label: "Custom image",

    xOffset: 0,
    yOffset: 0,
    rotation: -10,
    width: 600,

    shadowEnable: false,
    shadowColor: "black",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 10,
    doubleShadow: true,

    imageData: undefined,
    imageFileReader: undefined,
  },

  initialize: function (x, y) {
    this.set("x", x);
    this.set("y", y);
  },

  draw: function (context, x, y) {
    console.log("userimage draw!");

    if (this.get("enabled") && this.get("imageData") != undefined) {
      x = x || this.get("x");
      y = y || this.get("y");

      // save the context's co-ordinate system before
      // we screw with it
      context.save();

      context.translate(x, y);
      context.translate(this.get("xOffset"), this.get("yOffset"));
      context.rotate((this.get("rotation") * Math.PI) / 180);

      if (this.get("shadowEnable")) {
        context.shadowColor = this.get("shadowColor");
        context.shadowOffsetX = this.get("shadowOffsetX");
        context.shadowOffsetY = this.get("shadowOffsetY");
        context.shadowBlur = this.get("shadowBlur");
      } else {
        context.shadowColor = "transparent";
      }

      var scale = this.get("width") / this.get("imageData").width;
      console.log(
        scale + " = " + this.get("width") + " / " + this.get("imageData").width,
      );

      context.drawImage(
        this.get("imageData"),
        (-1 * scale * this.get("imageData").width) / 2,
        (-1 * scale * this.get("imageData").height) / 2,
        scale * this.get("imageData").width,
        scale * this.get("imageData").height,
      );

      // and restore the co-ordinate system to its default
      // top left origin with no rotation
      context.restore();
    }
  },
});
