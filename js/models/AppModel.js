var App = Backbone.Model.extend({
  initialize: function () {
    this.set(
      "cardTypes",
      new Backbone.Collection([
        { model: GearCard },
        { model: TownItemCard },
        { model: ConditionCard },
        { model: ThreatCard },
        { model: AbilityCard },
        { model: BountyCard },
        { model: ConditionCardBack },
        { model: TownItemCardBack },
        { model: TownItemIconCardBack },
        { model: AbilityCardBack },
      ]),
    );

    this.get("cardTypes").app = this;

    this.loadAssets(this.doneLoading);
  },

  doneLoading: function () {
    console.log("All loaded");

    this.set("card", new GearCard());

    this.set(
      "view",
      new AppView({
        el: "div#wrapper",
        model: this,
      }),
    );

    this.get("view").render();
  },

  loadAssets: function (callback) {
    var imagesLoaded = [];

    _.each(
      [
        "img/card-townItem.jpg",
        "img/card-mutation.jpg",
        "img/card-madness.jpg",
        "img/card-injury.jpg",
        "img/card-gear.jpg",
        "img/card-ability.jpg",
        "img/card-wanted.jpg",

        "img/card-threat-epic.jpg",
        "img/card-threat-high.jpg",
        "img/card-threat-med.jpg",
        "img/card-threat-low.jpg",
        "img/card-threat-jargono.jpg",
        "img/card-threat-targa.jpg",

        "img/cardback-mutation.jpg",
        "img/cardback-madness.jpg",
        "img/cardback-injury.jpg",
        "img/cardback-townitemA.jpg",
        "img/cardback-townitemB.jpg",
        "img/cardback-townitemC.jpg",
        "img/cardback-townitemD.jpg",
        "img/cardback-townitemE.jpg",
        "img/cardback-townitemF.jpg",
        "img/cardback-townitemBlank.jpg",

        "img/cardback-Bandido.png",
        "img/cardback-Gambler.png",
        "img/cardback-Gunslinger.png",
        "img/cardback-IndianScout.png",
        "img/cardback-Lawman.png",
        "img/cardback-Outlaw.png",
        "img/cardback-Preacher.png",
        "img/cardback-Rancher.png",
        "img/cardback-SaloonGirl.png",
        "img/cardback-USMarshal.png",

        "img/townicon-Blacksmith.png",
        "img/townicon-Church.png",
        "img/townicon-DocsOffice.png",
        "img/townicon-FrontierOutpost.png",
        "img/townicon-GeneralStore.png",
        "img/townicon-Saloon.png",

        "img/dice-2d6-blue.png",
        "img/dice-2d6-orange.png",
        "img/dice-2d6-green.png",
        "img/dice-d36-blue.png",
        "img/dice-d36-orange.png",
        "img/dice-d36-green.png",
        "img/dice-peril.png",

        "img/text-flourish-top.png",
        "img/text-flourish-bottom.png",

        "img/statHighlight.png",
        "img/classRestrictionHighlight.png",
        "img/classRestrictionHighlight-Multiline.png",

        "img/icon-lightsource.png",
        "img/icon-requiresupgradeslot.png",
        "img/icon-requires2upgradeslots.png",
        "img/icon-singlehand.png",
        "img/icon-doublehands.png",
        "img/icon-triplehands.png",
        "img/icon-1upgradeslot.png",
        "img/icon-darkstone.png",
        "img/icon-2darkstones.png",
        "img/icon-anvil.png",
        "img/icon-2anvils.png",
        "img/icon-2upgradeslots.png",
        "img/icon-3upgradeslots.png",
        "img/icon-coin.png",
        "img/icon-upgradedepth-1.png",
        "img/icon-upgradedepth-2.png",
        "img/icon-upgradedepth-3.png",
        "img/icon-upgradedepth-4.png",

        "img/background.png",
        "img/background2.png",
        "img/background3.png",
      ],
      function (url) {
        var loaded = $.Deferred();
        var cardArt = new Image();
        cardArt.src = url;
        cardArt.onload = function () {
          images[url] = cardArt;
          loaded.resolve();
        };
        imagesLoaded.push(loaded.promise());
      },
    );

    $.when(imagesLoaded).then(function () {
      console.log("Images loaded!");
    });

    var fontsLoaded = $.Deferred();
    this.loadFonts(
      ["berylium", "rockwell condensed", "dust west"],
      function () {
        console.log("Fonts loaded!");
        fontsLoaded.resolve();
      },
    );

    var minimumWait = $.Deferred();
    setTimeout(function () {
      console.log("Minimum wait!");
      minimumWait.resolve();
    }, 500);

    $.when
      .apply(
        $,
        imagesLoaded
          .concat([fontsLoaded.promise()])
          .concat([minimumWait.promise()]),
      )
      .then($.proxy(callback, this));
  },

  loadFonts: function (fonts, callback) {
    var loadedFonts = 0;
    for (var i = 0, l = fonts.length; i < l; ++i) {
      (function (font) {
        var node = document.createElement("span");
        // Characters that vary significantly among different fonts
        node.innerHTML = "giItT1WQy@!-/#";
        // Visible - so we can measure it - but not on the screen
        node.style.position = "absolute";
        node.style.left = "-10000px";
        node.style.top = "-10000px";
        // Large font size makes even subtle changes obvious
        node.style.fontSize = "300px";
        // Reset any font properties
        node.style.fontFamily = "sans-serif";
        node.style.fontVariant = "normal";
        node.style.fontStyle = "normal";
        node.style.fontWeight = "normal";
        node.style.letterSpacing = "0";
        document.body.appendChild(node);

        // Remember width with no applied web font
        var width = node.offsetWidth;

        node.style.fontFamily = font;

        var interval;
        function checkFont() {
          // Compare current width with original width
          if (node && node.offsetWidth != width) {
            ++loadedFonts;
            node.parentNode.removeChild(node);
            node = null;
          }

          // If all fonts have been loaded
          if (loadedFonts >= fonts.length) {
            if (interval) {
              clearInterval(interval);
            }
            if (loadedFonts == fonts.length) {
              console.log(loadedFonts + " / " + fonts.length);
              callback();
              return true;
            }
          }
        }

        if (!checkFont()) {
          interval = setInterval(checkFont, 50);
        }
      })(fonts[i]);
    }
  },

  showDonationModal: function () {
    $("#tipModal").show();
  },
});
