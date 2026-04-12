var Card = Backbone.Model.extend({
  constructor: function () {
    // Call the original constructor
    Backbone.Model.apply(this, arguments);

    this.set("cardType", "Generic Card");
    this.set("requiredText", {});
    this.set(
      "bodyTextOptions",
      new Backbone.Collection([
        { model: FluffText },
        { model: CardText },
        { model: StatChangeText },
        { model: SpacerText },
        { model: TopFlourishText },
        { model: BottomFlourishText },
      ]),
    );
    this.set("bodyText", new Backbone.Collection());
    this.set("toggleableText", {});
    this.set("toggleableIcons", {});
    this.set("userImages", []);
    this.set("bodyTextStartY", 400);

    this.set("backgroundOptions", new Backbone.Collection());

    this.get("bodyTextOptions").addTo = this.get("bodyText");
  },

  initialize: function () {},

  drawCard: function () {
    // Clear canvas
    this.get("context").canvas.width = this.get("context").canvas.width;

    this.drawBackground();

    this.drawUserImages();
    this.drawRequiredText();
    this.drawBodyText();
    this.drawToggleableText();
    this.drawToggleableIcons();

    if (window.location.protocol != "file:") {
      $.get("drawCounter.php", function (data) {
        $("#drawCount").html(data);
      });

      //take apart data URL
      var parts = this.get("context")
        .canvas.toDataURL()
        .match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);

      //assume base64 encoding
      var binStr = atob(parts[3]);

      //convert to binary in ArrayBuffer
      var buf = new ArrayBuffer(binStr.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i < view.length; i++) {
        view[i] = binStr.charCodeAt(i);
      }

      var blob = new Blob([view], { type: parts[1] });
      var urlCreator = window.URL || window.webkitURL;
      this.get("outputImg")[0].src = urlCreator.createObjectURL(blob);

      ga("send", "event", {
        eventCategory: "General Use",
        eventAction: "Card Draw",
        eventLabel: "Clicked",
      });

      if (window.umami) {
        window.umami.track("card-render", { cardType: this.get("cardType") });
      }
    }
  },

  drawBackground: function () {
    if (this.get("backgroundOptions").length > 0) {
      this.get("context").drawImage(
        images[
          this.get("backgroundOptions").findWhere({ enabled: true }).get("img")
        ],
        0,
        0,
      );
    } else {
      this.get("context").drawImage(images[this.get("background")], 0, 0);
    }
  },

  drawRequiredText: function () {
    _.each(
      this.get("requiredText"),
      function (text) {
        text.draw(this);
      },
      this.get("context"),
    );
  },

  drawBodyText: function () {
    var y = this.get("bodyTextStartY");

    this.get("bodyText").each(function (text) {
      y = text.draw(this, y);
      y += 25;
    }, this.get("context"));
  },

  drawToggleableText: function () {
    _.each(
      this.get("toggleableText"),
      function (text) {
        text.draw(this);
      },
      this.get("context"),
    );
  },

  drawToggleableIcons: function () {
    _.each(
      this.get("toggleableIcons"),
      function (icon) {
        icon.draw(this);
      },
      this.get("context"),
    );
  },

  drawUserImages: function () {
    _.each(
      this.get("userImages"),
      function (image) {
        image.draw(this);
      },
      this.get("context"),
    );
  },
});

var ItemCard = Card.extend({
  constructor: function () {
    // Call the original constructor
    Card.apply(this, arguments);

    this.set("requiredText", {
      title: new TitleText({
        y: 208,
      }),
      keywords: new KeywordsText({
        y: 274,
      }),
      price: new PriceText({
        y: 344,
      }),
    });

    this.set("toggleableText", {
      classRestriction: new ClassRestrictionText({
        y: 900,
        enabled: false,
      }),
      otherRestriction: new OtherRestrictionText({
        y: 600,
        enabled: false,
      }),
      coin: new Coin({
        x: 735,
        y: 1055,
        enabled: false,
      }),
    });

    this.set("toggleableIcons", {
      anvil: new AnvilIcon(120, 965),
      twoAnvils: new TwoAnvilsIcon(120, 891),

      darkStone: new DarkStoneIcon(105, 250),
      twoDarkStones: new TwoDarkStonesIcon(105, 250),

      singleHand: new SingleHandIcon(660, 950),
      twoHand: new TwoHandIcon(605, 950),
      threeHand: new ThreeHandIcon(555, 950),

      requiresUpgrade: new RequiresUpgradeIcon(270, 955),
      requiresTwoUpgrades: new Requires2UpgradesIcon(270, 955),

      tripleUpgrades: new TripleUpgradesIcon(270, 955),
      dualUpgrades: new DualUpgradesIcon(270, 955),
      singleUpgrade: new SingleUpgradeIcon(270, 955),
    });

    this.set("userImages", [new UserImage(450, 400)]);
  },

  drawToggleableText: function () {
    var tT = this.get("toggleableText");
    var tI = this.get("toggleableIcons");

    var baseline;

    // Calculate where to draw class restriction
    // Check if any other bottom icon is enabled
    if (
      _.any(tI, function (i) {
        return i.get("y") > 400 && i.get("enabled");
      })
    ) {
      baseline = 940;
    } else {
      baseline = 1030;
    }

    if (tT["otherRestriction"].get("enabled")) {
      tT["otherRestriction"].draw(this.get("context"), baseline);
      baseline -= 80;
    }
    if (tT["classRestriction"].get("enabled")) {
      if (tI["twoAnvils"].get("enabled")) {
        baseline = Math.min(890, baseline);
      }
      tT["classRestriction"].draw(this.get("context"), baseline);
    }

    if (tT["coin"].get("enabled")) {
      tT["coin"].draw(this.get("context"));
    }
  },

  drawToggleableIcons: function () {
    /*	_.each(
			this.get("toggleableIcons"),
			function(icon) {
				icon.draw(this);
			},
			this.get("context")
		);
	},*/

    tIKeys = [];
    for (var key in this.get("toggleableIcons")) tIKeys.push(key);

    _.each(
      tIKeys,
      function (tIKey) {
        tI = this.get("toggleableIcons")[tIKey];

        if (
          this.get("toggleableText")["coin"].get("enabled") &&
          ["singleHand", "twoHand", "threeHand"].indexOf(tIKey) > -1
        ) {
          tI.draw(this.get("context"), tI.get("x") - 100);
        } else if (
          this.get("toggleableText")["coin"].get("enabled") &&
          this.get("toggleableIcons")["threeHand"].get("enabled") &&
          ["tripleUpgrades"].indexOf(tIKey) > -1
        ) {
          tI.draw(this.get("context"), tI.get("x") - 40);
        } else {
          tI.draw(this.get("context"));
        }
      },
      this,
    );
  },
});

var TownItemCard = ItemCard.extend({
  constructor: function () {
    // Call the original constructor
    ItemCard.apply(this, arguments);

    this.set("cardType", "Town Item Card");
    this.set("background", "img/card-townItem.jpg");
    this.set("bodyTextStartY", 432);
    this.set("requiredText", {
      title: new TitleText({
        y: 208,
      }),
      keywords: new KeywordsText({
        y: 274,
      }),
      price: new PriceText({
        y: 344,
      }),
    });
  },
});

var GearCard = ItemCard.extend({
  constructor: function () {
    // Call the original constructor
    ItemCard.apply(this, arguments);

    this.set("cardType", "Gear Card");
    this.set("background", "img/card-gear.jpg");
    this.set("bodyTextStartY", 350);
    this.set("requiredText", {
      title: new TitleText({
        y: 208,
      }),
      keywords: new KeywordsText({
        y: 274,
      }),
    });
  },
});

var ConditionCard = Card.extend({
  constructor: function () {
    // Call the original constructor
    Card.apply(this, arguments);

    this.set("cardType", "Condition Card");

    this.set("bodyTextStartY", 340);
    this.set("toggleableIcons", {});

    this.set("background", "img/card-mutation.jpg");

    this.set(
      "backgroundOptions",
      new Backbone.Collection([
        new BackgroundOption("Mutation Card", "img/card-mutation.jpg", true),
        new BackgroundOption("Madness Card", "img/card-madness.jpg"),
        new BackgroundOption("Injury Card", "img/card-injury.jpg"),
      ]),
    );

    this.set("requiredText", {
      title: new TitleText({
        y: 214,
      }),
      keywords: new KeywordsText({
        content: "Mutation - Madness - Injury",
        y: 266,
      }),
    });

    this.set("toggleableText", {
      diceD36Green: new DiceD36Green({
        enabled: true,
      }),
      dice2D6Green: new Dice2D6Green({}),
      diceD36Blue: new DiceD36Blue({}),
      dice2D6Blue: new Dice2D6Blue({}),
      diceD36Orange: new DiceD36Orange({}),
      dice2D6Orange: new Dice2D6Orange({}),
    });
  },
});

var BountyCard = Card.extend({
  constructor: function () {
    // Call the original constructor
    Card.apply(this, arguments);

    this.set("cardType", "Bounty Card");

    this.set("bodyTextStartY", 340);
    this.set("toggleableIcons", {});
    this.set("toggleableText", {});
    this.set("bodyTextOptions", new Backbone.Collection());

    this.set("background", "img/card-wanted.jpg");

    this.set("requiredText", {
      wanted: new BountyTitleText({
        label: "Wanted",
        content: "MONSTERS",
        y: 845,
      }),
      description: new CardText({
        label: "Description",
        content:
          "for dragging unsuspecting townsfolks screaming into the darkness.",
        font: "normal 30px 'Berylium'",
        lineHeight: 30,
        y: 882,
      }),
      reward: new BountyTitleText({
        label: "Reward",
        content: "$200 REWARD",
        y: 990,
      }),
    });

    this.set("userImages", [
      new UserImage(450, 610).set({
        rotation: 0,
        width: 400,
      }),
    ]);
  },
});

var ThreatCard = Card.extend({
  constructor: function () {
    // Call the original constructor
    Card.apply(this, arguments);

    this.set("cardType", "Threat Card");

    this.set("requiredText", {});
    this.set("toggleableIcons", {});
    this.set("bodyTextOptions", new Backbone.Collection([]));

    this.set("background", "img/card-threat-epic.jpg");

    this.set(
      "backgroundOptions",
      new Backbone.Collection([
        new BackgroundOption("Epic Threat", "img/card-threat-epic.jpg", true),
        new BackgroundOption("High Threat", "img/card-threat-high.jpg"),
        new BackgroundOption("Med Threat", "img/card-threat-med.jpg"),
        new BackgroundOption("Low Threat", "img/card-threat-low.jpg"),
        new BackgroundOption("Jargono Threat", "img/card-threat-jargono.jpg"),
        new BackgroundOption("Targa Threat", "img/card-threat-targa.jpg"),
      ]),
    );

    this.set("toggleableText", {
      singleLineTitle: new MultilineText({
        y: 258,
        label: "Single Line Title",
        content: "$P$ Harbingers",

        font: "bold small-caps 100px 'Rockwell Condensed'",
        fillStyle: "black",
        shadowColor: "transparent",

        lineHeight: 59,
        maxWidth: 500,
        enabled: true,
      }),
      subTitle: new Text({
        y: 282,
        label: "Small Add-On",
        content: "AND 1 CORPSE PILE",

        font: "bold small-caps 30px 'Rockwell Condensed'",
        fillStyle: "black",
        shadowColor: "transparent",

        textAlign: "right",
        x: 725,

        enabled: true,
      }),
      twoLineTitle: new MultilineText({
        y: 220,
        label: "Two Line Title",
        content: "1 Night Terror and $P$ Hellbats",

        font: "bold small-caps 72px 'Rockwell Condensed'",
        fillStyle: "black",
        shadowColor: "transparent",

        lineHeight: 59,
        maxWidth: 500,
        enabled: false,
      }),
    });

    this.set("userImages", [
      new UserImage(450, 610).set({
        rotation: 0,
        width: 400,
      }),
    ]);
  },
});

var AbilityCard = Card.extend({
  constructor: function () {
    // Call the original constructor
    Card.apply(this, arguments);

    this.set("cardType", "Ability Card");

    this.set("bodyTextStartY", 420);

    this.set("toggleableIcons", {
      depth1: new AbilityDepth1Icon(253, 960),
      depth2: new AbilityDepth2Icon(253, 960),
      depth3: new AbilityDepth3Icon(253, 960),
      depth4: new AbilityDepth4Icon(253, 960),
    });

    this.set("background", "img/card-ability.jpg");

    this.set("requiredText", {});

    this.set(
      "bodyTextOptions",
      new Backbone.Collection([
        {
          model: MultilineText.extend({
            constructor: function () {
              // Call the original constructor
              Card.apply(this, arguments);

              this.set("label", "Upgrade Title");
              this.set("content", "Upgrade Title");

              this.set("font", "bold small-caps 60px 'Rockwell Condensed'");
              this.set("fillStyle", "black");
              this.set("shadowColor", "transparent");

              this.set("lineHeight", 59);
              this.set("maxWidth", 500);
            },
          }),
        },
        { model: CardText },
        { model: StatChangeText },
        { model: SpacerText },
      ]),
    );
    this.get("bodyTextOptions").addTo = this.get("bodyText");

    this.set("toggleableText", {
      singleLineTitle: new MultilineText({
        y: 245,
        label: "Upgrade Path - Single Line",
        content: "Upgrade Path",

        font: "bold small-caps 90px 'Rockwell Condensed'",
        fillStyle: "black",
        shadowColor: "transparent",

        lineHeight: 59,
        maxWidth: 500,
        enabled: true,
      }),
      twoLineTitle: new MultilineText({
        y: 208,
        label: "Upgrade Path - Two Line",
        content: "Complicated Upgrade Path",

        font: "bold small-caps 72px 'Rockwell Condensed'",
        fillStyle: "black",
        shadowColor: "transparent",

        lineHeight: 59,
        maxWidth: 500,
        enabled: false,
      }),
    });
  },
});

var CardBack = Card.extend({
  constructor: function () {
    // Call the original constructor
    Card.apply(this, arguments);

    this.set("cardType", "Generic Card Back");
    this.set("bodyTextOptions", new Backbone.Collection());
    this.set("background", "");
    this.set("backgroundOptions", new Backbone.Collection());
  },
});

var ConditionCardBack = CardBack.extend({
  constructor: function () {
    // Call the original constructor
    CardBack.apply(this, arguments);

    this.set("cardType", "Condition Card Back");
    this.set("background", "img/cardback-mutation.jpg");

    this.set(
      "backgroundOptions",
      new Backbone.Collection([
        new BackgroundOption(
          "Mutation Card Back",
          "img/cardback-mutation.jpg",
          true,
        ),
        new BackgroundOption("Madness Card Back", "img/cardback-madness.jpg"),
        new BackgroundOption("Injury Card Back", "img/cardback-injury.jpg"),
      ]),
    );
  },
});

var AbilityCardBack = CardBack.extend({
  constructor: function () {
    // Call the original constructor
    CardBack.apply(this, arguments);

    this.set("cardType", "Ability Card Back");
    this.set("background", "img/cardback-Bandido.png");

    this.set(
      "backgroundOptions",
      new Backbone.Collection([
        new BackgroundOption("Bandido", "img/cardback-Bandido.png", true),
        new BackgroundOption("Gambler", "img/cardback-Gambler.png"),
        new BackgroundOption("Gunslinger", "img/cardback-Gunslinger.png"),
        new BackgroundOption("Indian Scout", "img/cardback-IndianScout.png"),
        new BackgroundOption("Lawman", "img/cardback-Lawman.png"),
        new BackgroundOption("Outlaw", "img/cardback-Outlaw.png"),
        new BackgroundOption("Preacher", "img/cardback-Preacher.png"),
        new BackgroundOption("Rancher", "img/cardback-Rancher.png"),
        new BackgroundOption("Saloon Girl", "img/cardback-SaloonGirl.png"),
        new BackgroundOption("US Marshal", "img/cardback-USMarshal.png"),
      ]),
    );
  },
});

var TownItemCardBack = CardBack.extend({
  constructor: function () {
    // Call the original constructor
    CardBack.apply(this, arguments);

    this.set("cardType", "Town Item Card Back");
    this.set("background", "img/cardback-townitemA.jpg");

    this.set(
      "backgroundOptions",
      new Backbone.Collection([
        new BackgroundOption("Option A", "img/cardback-townitemA.jpg", true),
        new BackgroundOption("Option B", "img/cardback-townitemB.jpg"),
        new BackgroundOption("Option C", "img/cardback-townitemC.jpg"),
        new BackgroundOption("Option D", "img/cardback-townitemD.jpg"),
        new BackgroundOption("Option E", "img/cardback-townitemE.jpg"),
        new BackgroundOption("Option F", "img/cardback-townitemF.jpg"),
      ]),
    );

    this.set("requiredText", {
      title: new BevelTitleText({
        content: "Shop Name",
        y: 515,
      }),
    });
  },
});

var TownItemIconCardBack = CardBack.extend({
  constructor: function () {
    // Call the original constructor
    CardBack.apply(this, arguments);

    this.set("cardType", "Town Item Icon Card Back");
    this.set("background", "img/cardback-townitemBlank.jpg");

    this.set("toggleableIcons", {
      Blacksmith: new TownIconBlacksmith(200, 450),
      Church: new TownIconChurch(200, 450),
      DocsOffice: new TownIconDocsOffice(200, 450),
      FrontierOutpost: new TownIconFrontierOutpost(200, 450),
      GeneralStore: new TownIconGeneralStore(200, 450),
      Saloon: new TownIconSaloon(200, 450),
    });
  },
});
