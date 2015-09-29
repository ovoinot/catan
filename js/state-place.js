StatePlace.Start = 0;
StatePlace.FirstSettlement = 1;
StatePlace.FirstRoad = 2;
StatePlace.SecondSettlement = 3;
StatePlace.SecondRoad = 4;
StatePlace.Done = 5;

function StatePlace(game) {
  // score all board positions according to probabilities
  this.game = game;
  this.board = game.board;
  this.state = StatePlace.Start;
}

StatePlace.prototype.start = function() {
  if (this.state === StatePlace.Start) {
    $(".messages").text("Place your first Settlement.");
    this.state = StatePlace.FirstSettlement;
    return;
  }
}

StatePlace.prototype.execute = function(thing) {
  if (this.state === StatePlace.Done) {
    return;
  }

  if (this.state === StatePlace.FirstSettlement ||
      this.state === StatePlace.SecondSettlement) {
    if (thing instanceof Corner) {
      this.PlaceSettlement(thing);
    } else {
      $(".messages").text("Must place Settlement.");
    }
  } else if (this.state === StatePlace.FirstRoad ||
             this.state === StatePlace.SecondRoad) {
    if (thing instanceof Edge) {
      this.PlaceRoad(thing);

      // AI takes quick turns.
      this.AIPlaceSettlement();
    } else {
      $(".messages").text("Must place Road.");
    }
  }
};

StatePlace.prototype.finish = function() {
};

StatePlace.prototype.PlaceSettlement = function(thing) {
  var corner = thing;
  var key = corner.key();

  if (this.board.settlements[key]) {
    // do nothing. can't build a settlement twice.
    return;
  } else {
    var settlement = new Settlement(corner, "red");
    this.board.settlements[key] = settlement;

    if (this.state === StatePlace.FirstSettlement) {
      $(".messages").text("Place your first Road.");
      this.state = StatePlace.FirstRoad;
    }

    if (this.state === StatePlace.SecondSettlement) {
      this.initStartingResources(settlement);

      $(".messages").text("Place your second Road.");
      this.state = StatePlace.SecondRoad;
    }
  }
}

StatePlace.prototype.initStartingResources = function(settlement) {
  _.each(this.board.tiles, function(tile) {
    if (_.contains(ALL_RESOURCES, tile.resource)) {
      var corners = tile.shape.getCorners();
      _.each(corners, function(corner) {
        var key = corner.key()

        // award resources for second-placed settlement
        if (this.board.settlements[key] === settlement) {
          var player = this.board.settlements[key].player;
          RESOURCES[player][tile.resource.name] += 1;
        }
      }, this);
    }
  }, this);

  updateResources();
};

StatePlace.prototype.AIPlaceSettlement = function() {
  _.each(this.game.ais, function(ai) {
    var cornerKey = ai.bestAvailableCorner();
    var corner = Corner.lookup[cornerKey];
    
    var settlement = new Settlement(corner, ai.color);
    this.board.settlements[cornerKey] = settlement;

    var roads = this.board.cornerToEdges[cornerKey];
    var roadChoice = _.sample(roads);

    this.board.placeRoad(roadChoice, ai.color)
  }, this);
}

StatePlace.prototype.PlaceRoad = function(thing) {
  var edge = thing;
  var key = edge.key();

  // if there's no road there yet.
  if (!this.board.roads[key]) {
    if (this.state === StatePlace.FirstRoad) {
      this.placeFirstRoad(edge);
    } else if (this.state === StatePlace.SecondRoad) {
      this.placeSecondRoad(edge);
    }
  }
}

StatePlace.prototype.placeFirstRoad = function(edge) {
  if (this.board.placeRoad(edge, "red")) {
    $(".messages").text("Place your second Settlement.");
    this.state = StatePlace.SecondSettlement;
  } else {
    $(".messages").text("Road can't be placed here.");
  }
}

StatePlace.prototype.placeSecondRoad = function(edge) {
  var road = new Road(edge, "red");
  var key = edge.key();
  this.board.roads[key] = road;

  $(".messages").text("Roll away!!");

  this.state = StatePlace.Done;
  this.game.state = new StateBuild(this.game);
}

StatePlace.prototype.shouldGhostCorner = function(corner) {
  var result = false;

  if (this.state === StatePlace.FirstSettlement ||
      this.state === StatePlace.SecondSettlement) {
    result = true;

    // can't place a settlement over any previous settlement.
    // this especially prevents the drawer from ghosting city upgrades.
    if (this.board.settlements[corner.key()]) {
      return false;
    }

    var takenCornerKeys = _.union(
      _.keys(this.board.settlements),
      _.keys(this.board.cities)
    , this);

    // can't place right next to other settements or citites.
    _.each(takenCornerKeys, function(key) {
      var neighbors = this.board.cornerGraph[key];
      if (_.contains(neighbors, corner)) {
        result = false;
      }
    }, this);
  }

  return result;
};

StatePlace.prototype.shouldGhostRoad = function(edge) {
  var result = false;

  if (this.state === StatePlace.FirstRoad ||
      this.state === StatePlace.SecondRoad) {
    // the road can be placed if it's touching a settlement.
    _.each(this.board.settlements, function(settlement) {
      if (settlement.corner.equals(edge.c1) || settlement.corner.equals(edge.c2)) {
        result = true;
      }
    });

    _.each(this.board.cities, function(city) {
      if (city.corner.equals(edge.c1) || city.corner.equals(edge.c2)) {
        result = true;
      }
    });

    // or if it's touching an existing road network.
    _.each(this.board.roads, function(road) {
      var neighbors = this.board.edgeGraph[road.edge.key()];
      if (_.contains(neighbors, edge)) {
        result = true;
      }
    }, this);
  }

  return result;
};

StatePlace.prototype.shouldGhostRobber = function(tile) {
  return false;
};
