var TILE_SIZE = 50;
var SIDES = 6;

var EDGE_LENGTH = TILE_SIZE;
var HALF_EDGE = EDGE_LENGTH / 2;

var TILE_HEIGHT = Math.sqrt(3) / 2 * HALF_EDGE;

var PLAYERS = ["red", "orange", "green", "blue", "white", "orange"];

function Tile(x, y, resource, token) {
  this.resource = resource;
  this.token = token;
  this.hover = false;

  this.x = x;
  this.y = y;

  this.shape = new Hexagon(x, y, TILE_SIZE);
}

function TileGenerator() {
  var resources = new ResourceGenerator();
  var tokens = new TokenGenerator(2, 12);

  this.randomTile = function(x, y) {
    var resource = resources.randomResource(); 
    var token = tokens.randomToken();

    var tile = new Tile(x, y, resource, token);
    return tile;
  }
}

function TileDrawer(ctx) {
  this.ctx = ctx;
  this.tokenDrawer = new TokenDrawer(ctx);

  this.drawTiles = function(tiles) {
    this.ctx.save();

    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      this.draw(tile);
    }

    this.ctx.restore();

  };

  this.draw = function(tile) {
    var stroke = "black";
    if (tile.hover) {
      stroke = "blue";
    }

    tile.shape.fillStroke(this.ctx, tile.resource.color, stroke);

    if (tile.resource !== DESERT) {
      this.tokenDrawer.draw(tile.token, tile.x, tile.y);
    }
  }
}
