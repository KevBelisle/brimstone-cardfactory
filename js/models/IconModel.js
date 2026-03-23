var Icon = Backbone.Model.extend({
  defaults: {
    url: "",
    x: undefined,
    y: undefined,
    enabled: false,
  },

  initialize: function (x, y) {
    this.set("x", x);
    this.set("y", y);
  },

  draw: function (context, x, y) {
    x = x || this.get("x");
    y = y || this.get("y");

    if (this.get("enabled")) {
      context.shadowColor = "transparent";
      context.drawImage(images[this.get("url")], x, y);
    }
  },
});

var LightSourceIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Light Source",
    url: "img/icon-lightsource.png",
  }),
});

var RequiresUpgradeIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Requires 1 Upgrade Slot",
    url: "img/icon-requiresupgradeslot.png",
  }),
});

var Requires2UpgradesIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Requires 2 Upgrade Slots",
    url: "img/icon-requires2upgradeslots.png",
  }),
});

var SingleHandIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Single Handed",
    url: "img/icon-singlehand.png",
  }),
});

var SingleUpgradeIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 1 Upgrade Slot",
    url: "img/icon-1upgradeslot.png",
  }),
});

var DarkStoneIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 1 Dark Stone Icon",
    url: "img/icon-darkstone.png",
  }),
});

var TwoDarkStonesIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 2 Dark Stone Icons",
    url: "img/icon-2darkstones.png",
  }),
});

var AnvilIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 1 Anvil Icon",
    url: "img/icon-anvil.png",
  }),
});

var TwoAnvilsIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 2 Anvil Icons",
    url: "img/icon-2anvils.png",
  }),
});

var ThreeHandIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Three Handed",
    url: "img/icon-triplehands.png",
  }),
});

var TwoHandIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Two Handed",
    url: "img/icon-doublehands.png",
  }),
});

var DualUpgradesIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 2 Upgrade Slots",
    url: "img/icon-2upgradeslots.png",
  }),
});

var TripleUpgradesIcon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Has 3 Upgrade Slots",
    url: "img/icon-3upgradeslots.png",
  }),
});

var AbilityDepth1Icon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "First in Path",
    url: "img/icon-upgradedepth-1.png",
  }),
});

var AbilityDepth2Icon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Second in Path",
    url: "img/icon-upgradedepth-2.png",
  }),
});

var AbilityDepth3Icon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Third in Path",
    url: "img/icon-upgradedepth-3.png",
  }),
});

var AbilityDepth4Icon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Fourth in Path",
    url: "img/icon-upgradedepth-4.png",
  }),
});

var TownIconBlacksmith = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Blacksmith Icon",
    url: "img/townicon-Blacksmith.png",
  }),
});

var TownIconChurch = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Church Icon",
    url: "img/townicon-Church.png",
  }),
});

var TownIconDocsOffice = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Doc's Office Icon",
    url: "img/townicon-DocsOffice.png",
  }),
});

var TownIconFrontierOutpost = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Frontier Outpost Icon",
    url: "img/townicon-FrontierOutpost.png",
  }),
});

var TownIconGeneralStore = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "General Store Icon",
    url: "img/townicon-GeneralStore.png",
  }),
});

var TownIconSaloon = Icon.extend({
  defaults: _.extend({}, Icon.prototype.defaults, {
    label: "Saloon Icon",
    url: "img/townicon-Saloon.png",
  }),
});
