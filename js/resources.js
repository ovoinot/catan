var LOG_RESOURCES = false;
var ROBBER_LIMIT = 7;

var BRICK = {
  name: "brick", /* Kathari */
  color: "Blue",
  src:  "https://cdn.discordapp.com/attachments/814201372249030669/933389421909258310/75_Kathari_Loop.gif"
};

var WHEAT = {
  name: "wheat", /* Marcolian */
  color: "Red",
  src:  "https://cdn.discordapp.com/attachments/814201372249030669/933389422198661120/75_Marcoliane_Loop.gif"
};

var WOOD = {
  name: "wood", /* AUgencore */
  color: "Orange",
  src: "https://cdn.discordapp.com/attachments/814201372249030669/933389422752313394/75_Augencore_Loop.gif"
};                

var SHEEP = {
  name: "sheep", /* Earthen*/
  color: "GreenYellow",
  src: "https://cdn.discordapp.com/attachments/814201372249030669/933389421645029396/75_Earthen_Loop.gif"
};                

var ORE = {
  name: "ore", /* will be shroud */
  color: "Purple",
  src: "https://cdn.discordapp.com/attachments/814201372249030669/933389422488084540/75_Shroud_Loop.gif"
};                

var DESERT = {
  name: "desert", /* will be singularity...*/
  color: "rgba(255, 255, 255, 0.5)", // "#E5E8E8",
};                

var WATER = {
  name: "water", /* will be space...*/
  color: "rgba(100, 100, 100, 0.5)"
};                

var ALL_RESOURCES = [BRICK, WHEAT, WOOD, SHEEP, ORE];
var RESOURCES = {};

function ResourceGenerator() {
  this.randomResource = function() {
    if (Math.random() < 1 / 20) {
      return DESERT;
    } else {
      var choice = Math.round((ALL_RESOURCES.length - 1)* Math.random());
      var resource = ALL_RESOURCES[choice];
      return resource;
    }
  }
}

function initResources(players) {
  // initialize each player
  _.each(players, function(player) {
    RESOURCES[player] = {};
  });

  // initialize resources for each player
  _.each(players, function(player) {
    _.each(ALL_RESOURCES, function(resource) {
      RESOURCES[player][resource.name] = 0;
    });
  });

  // style the display of resources properly
  _.each(ALL_RESOURCES, function(resource) {
    var selector = ".resources .resource." + resource.name;
    var style = {'background-color': resource.color};
    $(selector).css(style);
  });

  updateResources();
}

function updateResources(players) {
  _.each(ALL_RESOURCES, function(resource) {
    var selector = ".resources .value." + resource.name;

    var available = RESOURCES[MAIN_PLAYER][resource.name];
    $(selector).text(available);
  });

  if (LOG_RESOURCES) {
    console.log("");
    _.each(players, function(player) {
      console.log(totalResources(player), player, RESOURCES[player]);
    });
  }
}

function totalResources(player) {
  var total = 0;
  _.each(ALL_RESOURCES, function(resource) {
    total += RESOURCES[player][resource.name];
  });

  return total;
}

function halveResources(players) {
  _.each(players, function(player) {
    var playerTotal = totalResources(player);
    if (playerTotal > ROBBER_LIMIT) {
      _.each(ALL_RESOURCES, function(resource) {
        // count available
        var available = RESOURCES[player][resource.name];
        available = Math.ceil(available / 2);

        // update what's left
        RESOURCES[player][resource.name] = available;
      });
    }
  });

  updateResources();
}

var Resources = {};

Resources.canBuyRoad = function(player) {
  if (RESOURCES[player][BRICK.name] > 0 && RESOURCES[player][WOOD.name] > 0) {
    return true;
  }
  return false;
}

Resources.buyRoad = function(player) {
  if (Resources.canBuyRoad(player)) {
    GameLog("built Road.", player);

    RESOURCES[player][BRICK.name] = Math.max(0, RESOURCES[player][BRICK.name] - 1);
    RESOURCES[player][WOOD.name] = Math.max(0, RESOURCES[player][WOOD.name] - 1);

    updateResources();
    return true;
  } else {
    return false;
  }
};

Resources.canBuySettlement = function(player) {
  if (RESOURCES[player][BRICK.name] > 0 && RESOURCES[player][WOOD.name] > 0 &&
      RESOURCES[player][WHEAT.name] > 0 && RESOURCES[player][SHEEP.name] > 0) {
    return true;
  }
  return false;
};

Resources.buySettlement = function(player) {
  if (Resources.canBuySettlement(player)) {
    GameLog("built Settlement.", player);

    RESOURCES[player][BRICK.name] = Math.max(0, RESOURCES[player][BRICK.name] - 1);
    RESOURCES[player][WOOD.name] = Math.max(0, RESOURCES[player][WOOD.name] - 1);
    RESOURCES[player][WHEAT.name] = Math.max(0, RESOURCES[player][WHEAT.name] - 1);
    RESOURCES[player][SHEEP.name] = Math.max(0, RESOURCES[player][SHEEP.name] - 1);

    updateResources();
    return true;
  } else {
    return false;
  }
};

Resources.canBuyCity = function(player) {
  if (RESOURCES[player][ORE.name] > 2 && RESOURCES[player][WHEAT.name] > 1) {
    return true;
  }
  return false;
}

Resources.buyCity = function(player) {
  if (Resources.canBuyCity(player)) {
    GameLog("built City.", player);

    RESOURCES[player][ORE.name] = Math.max(0, RESOURCES[player][ORE.name] - 1);
    RESOURCES[player][ORE.name] = Math.max(0, RESOURCES[player][ORE.name] - 1);
    RESOURCES[player][ORE.name] = Math.max(0, RESOURCES[player][ORE.name] - 1);
    RESOURCES[player][WHEAT.name] = Math.max(0, RESOURCES[player][WHEAT.name] - 1);
    RESOURCES[player][WHEAT.name] = Math.max(0, RESOURCES[player][WHEAT.name] - 1);

    updateResources();
    return true;
  } else {
    return false;
  }
};

Resources.resourceFromString = function(name) {
  for (var i = 0; i < ALL_RESOURCES.length; i++) {
    if (ALL_RESOURCES[i].name === name) {
      return ALL_RESOURCES[i];
    }
  }
};
