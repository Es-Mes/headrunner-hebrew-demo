Quintus["Popups"] = function (Q) {
  var popup_fill = "green";

  Q.scene('getAnswer', function (stage) {

    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2 - 150, y: Q.height / 2, fill: popup_fill
    }));

    var button = container.insert(new Q.UI.Button({
      x: 235, y: 100, fill: "#CCCCCC",
      label: "אישור"
    }));
    var clear = container.insert(new Q.UI.Button({
      x: 250, y: 150, fill: "#CCCCCC",
      label: "נקה"
    }))
      .on("click", function () {
        answer.p.label = "?";
      });
    var answer = container.insert(new Q.UI.Text({
      x: 120, y: 0,
      label: 'הכנס תשובה מהר!',
      fill: "#FFFFFF"
    }));
    var answer = container.insert(new Q.UI.Text({
      x: 120, y: 50,
      label: '?',
      fill: "#FFFFFF"
    }));
    var timer_label = container.insert(new Q.UI.Text({
      x: 230, y: 50,
      label: 'זמן',
      fill: "#FFFFFF"
    }));
    var expression = container.insert(new Q.UI.Text({
      x: 30, y: 50,
      fill: "#FFFFFF"
    }));

    var x = -50, y = 100;
    for (var key in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
      container.insert(new Q.UI.Button({
        x: x, y: y, fill: "#CCCCCC",
        label: key
      }))
        .on("click", function () {
          if (!parseInt(answer.p.label)) {
            answer.p.label = ""
          }
          answer.p.label = answer.p.label + this.p.label;
        });
      if (key == 4) {
        x -= 250;
        y = 150;
      }
      x += 50;
    }

    var random_a = Math.floor((Math.random() * 100) + 1);
    var random_b = Math.floor((Math.random() * 100) + 1);
    expression.p.label = random_a.toString() + ' + ' + random_b.toString() + ' = ';
    random_result = random_a + random_b;

    button.on("click", function () {
      if (parseInt(answer.p.label) == random_result) {
        Q.stages[0].lists.QuestionHead[0].off("bump.left");
        delete Q.stages[1];
        Q.stages[0].lists.Player[0].add('platformerControls');
        Q('GuardHead', 0).destroy();
        Q.stageScene("level1Boss", 0);
      }
      else {
        Q.stageScene("endGame", 1, { label: "הפסדת" });
        Q.stages[0].lists.Player[0].destroy();
      }
    });

    var timer = 1000;

    function countdown() {
      if (timer == 0) {
        Q.stageScene("endGame", 1, { label: "הפסדת" });
      }
      timer -= 1;
      return timer.toString();
    }

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
      timer_label.p.label = countdown();

    }

    container.fit(20);
    stage.container = container;
  });

  Q.scene('endGame', function (stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2, y: Q.height / 2, fill: popup_fill
    }));

    var button = container.insert(new Q.UI.Button({
      x: 10, y: 0, fill: "#CCCCCC",
      label: stage.options.button || "התחל מחדש"
    }))
    var label = container.insert(new Q.UI.Text({
      x: 10, y: -10 - button.p.h,
      label: stage.options.label || "סיום משחק"
    }));
    Q('Player', 0).destroy();
    button.on("click", function () {
      Q.clearStages();
      Q.stageScene('level1');
    });

    container.fit(20);
  });

  Q.scene('giveKey', function (stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2, y: Q.height / 2, fill: popup_fill
    }));

    var button = container.insert(new Q.UI.Button({
      x: 0, y: 0, fill: "#CCCCCC",
      label: "אישור"
    }))
    var label = container.insert(new Q.UI.Text({
      x: 10, y: -10 - button.p.h,
      label: 'תן לי 3 גבישים ואפתח את הדלת'
    }));
    button.on("click", function () {
      container.destroy();
      Q.stages[0].lists.Player[0].add('platformerControls');
    });

    container.fit(20);
  });

  Q.scene('simplePopup', function (stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2, y: Q.height / 2, fill: popup_fill
    }));
    var text;
    var permit = "name" in Q.stages[0].lists.Player[0].p.items &&
      Q.stages[0].lists.Player[0].p.items["name"] == "banana"
    if (permit) {
      text = "בננה!!! בוא בבקשה"
    }
    else {
      text = "אררר!!! לך מכאן!"
    }

    var label = container.insert(new Q.UI.Text({ x: 10, y: -60, label: text }));
    var button = container.insert(new Q.UI.Button({
      x: 0, y: -10, fill: "#CCCCCC",
      label: "אישור"
    }))
    button.on("click", function () {
      container.destroy();
      Q.stages[0].lists.Player[0].add('platformerControls');
      if (permit) {
        Q.stages[0].lists.MonkeyHead[0].destroy();
      }
    })

    container.fit(20);
  });

  Q.scene('simplePopup1', function (stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2, y: Q.height / 2, fill: popup_fill
    }));

    var label = container.insert(new Q.UI.Text({ x: 10, y: -60, label: 'הדלת לשלב החדש נפתחה!' }));
    var button = container.insert(new Q.UI.Button({
      x: 0, y: -10, fill: "#CCCCCC",
      label: "אישור"
    }))
    button.on("click", function () {
      container.destroy();
      Q.stages[0].lists.Player[0].add('platformerControls');
    })

    container.fit(20);
  });

  Q.scene('userPanel', function (stage) {
    var container = stage.insert(new Q.UI.Container({
      x: 50, y: 100, fill: 'green'
    }));

    var label = container.insert(new Q.UI.Text({ x: 10, y: -60, label: 'פריטים:' }));
    var crystal = container.insert(new Q.UI.Crystal({ x: -10, y: -30 }))
    var crystal_count = container.insert(new Q.UI.Text({ x: 20, y: -30, label: 'x 0' }));

    container.fit(20);
  });


}
