document.addEventListener('DOMContentLoaded', function() {
    var Fireworks, GRAVITY, K, SPEED, ToRadian, canvas, context, ctx, fireBoss, repeat, stage;      
    canvas = document.getElementById("canvas");      
    context = canvas.getContext("2d");      
    canvas.width = window.innerWidth;      
    canvas.height = window.innerHeight;      
    stage = new createjs.Stage(canvas);      
    stage.autoClear = false;      
    ctx = canvas.getContext("2d");      
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, canvas.width, canvas.height);      
    createjs.Ticker.setFPS(30);      
    createjs.Touch.enable(stage);  
    stage.update();
  
    // 重力
    GRAVITY = 2;
  
    // 加速度
    K = 0.9;
  
    // 速度
    SPEED = 10;
  
    // 从度数转换为弧度
    ToRadian = function(degree) {
      return degree * Math.PI / 180.0;
    };
  
    // 制作烟花的class
    Fireworks = class Fireworks {
      constructor(sx = 100, sy = 100, particles = 99) {
        var circle, i, j, rad, ref, speed;
        this.sx = sx;
        this.sy = sy;
        this.particles = particles;
        this.sky = new createjs.Container();
        this.r = 0;
        this.h = Math.random() * 360 | 0;
        this.s = 100;
        this.l = 50;
        this.size = 6;
        for (i = j = 0, ref = this.particles; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          speed = Math.random() * SPEED * 6 + SPEED;
          circle = new createjs.Shape();
          circle.graphics.f(`hsla(${this.h}, ${this.s}%, ${this.l}%, 1)`).dc(0, 0, this.size);
          circle.snapToPixel = true;
          circle.compositeOperation = "lighter";
          rad = ToRadian(Math.random() * 360 | 0);
          circle.set({
            x: this.sx,
            y: this.sy,
            vx: Math.cos(rad) * speed,
            vy: Math.sin(rad) * speed,
            rad: rad
          });
          this.sky.addChild(circle);
        }
        stage.addChild(this.sky);
      }
  
      explode() {
        var circle, j, p, ref;
        if (this.sky) {
          this.h += 5;
          var k = K;
          for (p = j = 0, ref = this.sky.getNumChildren(); (0 <= ref ? j < ref : j > ref); p = 0 <= ref ? ++j : --j) {
            circle = this.sky.getChildAt(p);
            // 加速度
            circle.vx = circle.vx * k;
            circle.vy = circle.vy * k;
            // 位置计算
            circle.x += circle.vx;
            circle.y += circle.vy + GRAVITY;
  
            this.l = 50;
            // 粒度
            this.size = this.size - 0.001;
            if (this.size > 0) {
              circle.graphics.c().f(`hsla(${this.h}, 100%, ${this.l}%, 1)`).dc(0, 0, this.size);
            }
          }
          if (this.sky.alpha > 0.1) {
            this.sky.alpha -= K / 50;
          } else {
            stage.removeChild(this.sky);
            this.sky = null;
          }
        } else {    
        }
      }    
    };
  
    fireBoss = [];

    function addFirework(x, y, n) {
      for (var i = 0; i < n; ++i) {
        fireBoss.push(new Fireworks(x, y))
      }
    }
  
    setInterval(function() {
      ctx.fillStyle = "rgba(16, 31, 48, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, 40);

    currentFirework = 0;
    fireWorkSequence = new Array();
    firstHeight = 0;
    for (var i = 0; i < 6; ++i) {
      fireWorkSequence[i] = function() {
        var x = canvas.width / 2;
        var y  = canvas.height;
        addFirework(x * 1.25, y * (1 - firstHeight * 0.1), 2);
        addFirework(x * 0.75, y * (1 - firstHeight * 0.1), 2);
        ++firstHeight;
      };
    }
    fireWorkSequence[6] = function() {
      var x = canvas.width;
      var y  = canvas.height;
      for (var i = 0; i < 5; ++i) {
        for (var j = 0; j < 5; ++j) {
          addFirework(x * 0.2 * i + x * 0.1, y * 0.2 * j + y * 0.1, 2);
        }
      }
    };
    for (var i = 7; i < 22; ++i) {
      fireWorkSequence[i] = function() {
        for (var i = 0; i < 3; ++i) {
          var x = canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6;
          var y = canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.6;
          addFirework(x, y, 2);
        }
      }
    }
    fireWorkSequence[22] = function() {
      var xUnit = canvas.width / 10;
      var yUnit  = canvas.height / 10;
      addFirework(0 * xUnit + xUnit / 2, 2 * yUnit + yUnit / 2, 2);
      addFirework(0 * xUnit + xUnit / 2, 3 * yUnit + yUnit / 2, 2);
      addFirework(1 * xUnit + xUnit / 2, 1 * yUnit + yUnit / 2, 2);
      addFirework(1 * xUnit + xUnit / 2, 4 * yUnit + yUnit / 2, 2);
      addFirework(1 * xUnit + xUnit / 2, 5 * yUnit + yUnit / 2, 2);
      addFirework(2 * xUnit + xUnit / 2, 0 * yUnit + yUnit / 2, 2);
      addFirework(2 * xUnit + xUnit / 2, 6 * yUnit + yUnit / 2, 2);
      addFirework(3 * xUnit + xUnit / 2, 0 * yUnit + yUnit / 2, 2);
      addFirework(3 * xUnit + xUnit / 2, 7 * yUnit + yUnit / 2, 2);
      addFirework(4 * xUnit + xUnit / 2, 1 * yUnit + yUnit / 2, 2);
      addFirework(4 * xUnit + xUnit / 2, 8 * yUnit + yUnit / 2, 2);
      addFirework(5 * xUnit + xUnit / 2, 1 * yUnit + yUnit / 2, 2);
      addFirework(5 * xUnit + xUnit / 2, 8 * yUnit + yUnit / 2, 2);
      addFirework(6 * xUnit + xUnit / 2, 0 * yUnit + yUnit / 2, 2);
      addFirework(6 * xUnit + xUnit / 2, 7 * yUnit + yUnit / 2, 2);
      addFirework(7 * xUnit + xUnit / 2, 0 * yUnit + yUnit / 2, 2);
      addFirework(7 * xUnit + xUnit / 2, 6 * yUnit + yUnit / 2, 2);
      addFirework(8 * xUnit + xUnit / 2, 1 * yUnit + yUnit / 2, 2);
      addFirework(8 * xUnit + xUnit / 2, 4 * yUnit + yUnit / 2, 2);
      addFirework(8 * xUnit + xUnit / 2, 5 * yUnit + yUnit / 2, 2);
      addFirework(9 * xUnit + xUnit / 2, 2 * yUnit + yUnit / 2, 2);
      addFirework(9 * xUnit + xUnit / 2, 3 * yUnit + yUnit / 2, 2);
    }
    fireWorkSequence[23] = function() {
      document.getElementById("contents").style.opacity = 1;
    }
  
    setInterval(function() {
      fireWorkSequence[currentFirework]();
      if (currentFirework < fireWorkSequence.length - 1) {
        ++currentFirework;
      }
    }, 600);
  
    repeat = function() {
      var fireworks, j, ref;
      for (fireworks = j = 0, ref = fireBoss.length; (0 <= ref ? j < ref : j > ref); fireworks = 0 <= ref ? ++j : --j) {
        if (fireBoss[fireworks].sky) {
          fireBoss[fireworks].explode();
        }
      }
      stage.update();
    };
  
    createjs.Ticker.on("tick", repeat);
  
    stage.addEventListener("stagemousedown", function() {
      addFirework(stage.mouseX, stage.mouseY, 2);
    });      
  }, false);
  