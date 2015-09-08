$(document).ready(main);

var MOUSE_X = 0;
var MOUSE_Y = 0;

function main() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var ctx = canvas.getContext("2d");

  var rows = Math.ceil(canvas.height / TILE_SIZE * 1.5);
  var cols = Math.ceil(canvas.width / TILE_SIZE * 1.72);

  $(document).mousemove(function(e) {
    MOUSE_X = e.offsetX;
    MOUSE_Y = e.offsetY;

    var tile = board.getTile(MOUSE_X, MOUSE_Y);
    tile.hover = true;
  });

  $(document).click(function(e) {
    MOUSE_X = e.offsetX;
    MOUSE_Y = e.offsetY;

    var tile = board.getTile(MOUSE_X, MOUSE_Y);
  });

  var board = new Board(rows, cols);
  var boardDrawer = new BoardDrawer(ctx);

  var loop;
  loop = function() {
    boardDrawer.draw(board);
    window.requestAnimationFrame(loop);
  }

  loop();
}
