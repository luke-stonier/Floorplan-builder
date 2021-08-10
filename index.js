class FloorplanItem {
  constructor(gridSize, name, image, width, height, x, y, action) {
    this.name = name;
    this.image = image;
    this.height = height;
    this.width = width;
    this.x = x * gridSize;
    this.y = y * gridSize;
    this.action = action;
  }

  Draw(ctx) {
    var img = new Image();
    var that = this;
    img.onload = function () {
      ctx.drawImage(img, that.x, that.y, that.width, that.height);
    };
    img.src = this.image;
  }

  CallAction() {
    this.action(this);
  }
}

// Grid config
var gridSize = 50;
elements = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
window.addEventListener("resize", DrawUI);

// Floorplan items
var regularBed = new FloorplanItem(
  gridSize,
  "Bed",
  "./images/bed.png",
  gridSize,
  gridSize * 2,
  0,
  0,
  (_) => MakeItemRequest(_)
);

var mattsBed = new FloorplanItem(
  gridSize,
  "Matts bed",
  "./images/bed.png",
  gridSize * 2,
  gridSize * 4,
  1,
  0,
  (_) => MakeItemRequest(_)
);

function MakeItemRequest(item) {
  console.log(item);
  document.getElementById("respText").innerText = item.name;
}

// Add elements to render list
elements.push(regularBed, mattsBed);

function setCanvasSize() {
  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight / 2;
}

function DrawGrid(debug) {
  var xindex = 0;
  var yindex = 0;
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.fillStyle = (xindex + yindex) % 2 == 0 ? "#FFFFFF" : "#E3E3E3";
      ctx.fillRect(x, y, gridSize, gridSize);

      if (debug) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px serif";
        ctx.fillText(xindex + "," + yindex, x, y + 10);
      }

      yindex++;
    }
    yindex = 0;
    xindex++;
  }
}

function DrawUI() {
  setCanvasSize();
  var elemLeft = canvas.offsetLeft + canvas.clientLeft;
  var elemTop = canvas.offsetTop + canvas.clientTop;

  canvas.addEventListener(
    "click",
    function (event) {
      document.getElementById("respText").innerText = "";
      var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

      // Collision detection between clicked offset and element.
      elements.forEach(function (element) {
        if (
          y > element.y &&
          y < element.y + element.height &&
          x > element.x &&
          x < element.x + element.width
        ) {
          element.CallAction();
        }
      });
    },
    false
  );

  DrawGrid(false);
  elements.forEach((element) => element.Draw(ctx));
}

DrawUI();
