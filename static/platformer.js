window.addEventListener("load", function () {

  var Q = window.Q = Quintus()
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
    .include("Enemies, Neutral, Items, Popups, CustomUI")
    .setup({ width: 800, height: 800 })
    .controls().touch()

  Q.Sprite.extend("Player", {

    init: function (p) {

      this._super(p, {
        sheet: "player",  // Setting a sprite sheet sets sprite width and height
        x: 410,           // You can also set additional properties that can
        y: 90,             // be overridden on object creation
        items: [],
        true_items: {
          crystal: {
            'count': 0
          }
        }
      });
      this.add('2d, platformerControls');
    },
    update: function (dt) {
      if (parseInt(this.p.y / 100) * 100 == parseInt(Q.height % 10) * 100 + 500) {
        Q.stageScene("endGame", 1)
      }
      this.trigger('prestep', dt);
      if (this.step) { this.step(dt); }
      this.trigger('step', dt);
      this.refreshMatrix();
      Q._invoke(this.children, "frame", dt);
    },
    remove_item: function (item_name) {
      if (this.p.true_items[item_name].count != 0) {
        this.p.true_items[items_name].count -= 1;
        Q.stage(2).lists['UI.Text'][1].p.label = 'x ' + this.p.true_items.crystal.count;
      }
    },
    remove_all_item: function (item_name) {
      this.p.true_items[item_name].count = 0;
      Q.stage(2).lists['UI.Text'][1].p.label = 'x ' + 0;
    },
    add_item: function (item_name) {
      this.p.true_items[item_name].count += 1;
      Q.stage(2).lists['UI.Text'][1].p.label = 'x ' + this.p.true_items.crystal.count;
    }


  });

  Q.scene('startScreen', function (stage) {
    stage.insert(new Q.Repeater({ asset: "screen.png", speedX: 0, speedY: 0 }));

    // רקע למסך הוראות
    var background = stage.insert(new Q.UI.Container({
      x: 400, y: 300,
      w: 600, h: 400,
      fill: "rgba(0, 0, 0, 0.8)",
      border: 3,
      stroke: "#FFFFFF"
    }));

    var title = stage.insert(new Q.UI.Text({
      x: 400, y: 150,
      label: "משחק ראש רץ",
      color: "#FFFFFF",
      size: 32,
      align: "center"
    }));

    var instructions = stage.insert(new Q.UI.Text({
      x: 400, y: 220,
      label: ":איך לשחק",
      color: "#FFFF00",
      size: 24,
      align: "center"
    }));

    var inst1 = stage.insert(new Q.UI.Text({
      x: 400, y: 260,
      label: "תנועה - חצים ימין/שמאל •",
      color: "#FFFFFF",
      size: 18,
      align: "center"
    }));

    var inst2 = stage.insert(new Q.UI.Text({
      x: 400, y: 290,
      label: "X קפיצה - חץ עליון או •",
      color: "#FFFFFF",
      size: 18,
      align: "center"
    }));

    var inst3 = stage.insert(new Q.UI.Text({
      x: 400, y: 320,
      label: "אסוף 3 גבישים והגע לדלת •",
      color: "#00FF00",
      size: 18,
      align: "center"
    }));

    var inst4 = stage.insert(new Q.UI.Text({
      x: 400, y: 350,
      label: "הימנע מאויבים ופתור חידות •",
      color: "#FF6666",
      size: 18,
      align: "center"
    }));

    var button = stage.insert(new Q.UI.Button({
      x: 400,
      y: 420,
      label: "התחל משחק",
      fill: "#4CAF50",
      fontColor: "#FFFFFF",
      border: 2,
      stroke: "#FFFFFF"
    }));
    button.on("click", function () {
      Q.stageScene("level1");
    })

  });


  Q.scene("level1", function (stage) {

    stage.insert(new Q.Repeater({ asset: "forest.png", speedX: 0.5, speedY: 0.5 }));
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet: 'tiles'
    }));

    stage.step = function (dt) {
      if (this.paused) { return false; }

      this.trigger("prestep", dt);
      this.updateSprites(this.items, dt);
      this.trigger("step", dt);

      if (this.removeList.length > 0) {
        for (var i = 0, len = this.removeList.length; i < len; i++) {
          this.forceRemove(this.removeList[i]);
        }
        this.removeList.length = 0;
      }
      this.trigger('poststep', dt);
    }


    var player = stage.insert(new Q.Player({ x: 324, y: 153 }));

    stage.add("viewport").follow(player);

    stage.insert(new Q.DummyHead({ x: 10, y: 0, vx: 203 }));
    stage.insert(new Q.DummyHead({ x: 70, y: 0, vx: 203 }));
    stage.insert(new Q.DummyHead({ x: 120, y: 0, vx: 203 }));
    stage.insert(new Q.DummyHead({ x: 1290, y: 203, vx: -204 }));
    stage.insert(new Q.DummyHead({ x: 1335, y: 203, vx: -204 }));
    stage.insert(new Q.DummyHead({ x: 1829, y: 203, vx: 0, name: 'guard' }));
    stage.insert(new Q.BirdHead({ x: 1835, y: 203, vx: 200, left_position: 100, right_position: 500 }));
    stage.insert(new Q.QuestionHead({
      x: 2425, y: 303, dialog: 'getAnswer',
      collisionCallback: function () {

      }
    }));
    stage.insert(new Q.GuardHead({ x: 2450, y: 227 }));

    stage.insert(new Q.DummyHead({ x: 2780, y: 200, vx: 40 }));
    stage.insert(new Q.DummyHead({ x: 3140, y: 200, vx: -30 }));
    stage.insert(new Q.DummyHead({ x: 3090, y: 200, vx: -20 }));
    stage.insert(new Q.DummyHead({ x: 3240, y: 200, vx: -50 }));


    stage.insert(new Q.QuestionHead({
      x: 3625, y: 203, dialog: 'giveKey', collision_callback: function (player) {
        if (player.p.true_items.crystal.count == 3) {
          this.destroy();
          Q.stageScene("simplePopup1", 1);
          Q.stage().insert(new Q.Door({ x: 4600, y: 70 }));
        }
      }
    }));



    stage.insert(new Q.BirdHead({ x: 4235, y: 3, vx: 200, left_position: 100, right_position: 500 }));

    stage.insert(new Q.Crystal({ x: 2480, y: 50 }));
    stage.insert(new Q.Crystal({ x: 3410, y: 300 }));
    stage.insert(new Q.Crystal({ x: 4600, y: 250 }));

    Q.stageScene("userPanel", 2);
  });

  Q.load("screen.png, door1.png, crystal.png, questionhead.png, weapon.png, birdhead.png, forest.png, jumphead1.png, jumphead.png, dummyhead.png, sprites3.png, sprites.json, level.json, tiles.png, background-wall.png", function () {

    Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

    Q.compileSheets("sprites3.png", "sprites.json");
    Q.sheet("player", "jumphead.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 24, "frames": 1 });
    Q.sheet("enemy", "dummyhead.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 24, "frames": 1 });
    Q.sheet("birdhead", "birdhead.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 24, "frames": 1 });
    Q.sheet("weapon", "weapon.png", { "sx": 0, "sy": 0, "tilew": 7, "tileh": 21, "frames": 1 });
    Q.sheet("questionhead", "questionhead.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 24, "frames": 1 });
    Q.sheet("monkeyhead", "questionhead.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 24, "frames": 1 });
    Q.sheet("crystal", "crystal.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 24, "frames": 1 });
    Q.sheet("door", "door1.png", { "sx": 0, "sy": 0, "tilew": 30, "tileh": 58, "frames": 1 });
    Q.sheet("screen", "screen.png", { "sx": 0, "sy": 0, "tilew": 800, "tileh": 800, "frames": 1 });
    Q.stageScene("startScreen");
  });


});
