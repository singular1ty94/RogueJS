//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94
var RogueJSData = {};
var RogueJSEntities = [];

var COLOR_FOV_WALL = "#888";
var COLOR_FOV_FLOOR = "#555";
var COLOR_DISCOVERED_WALL = "#444";
var COLOR_DISCOVERED_FLOOR = "#222";
var MIN_MOBS = 3;
var MAX_MOBS = 10;

var RogueJS = {    
    w : 95,
    h : 28,
    display : null,
    hud : null,
    map : null,
    player : null,
    engine : null,
    fov : null,
    scheduler: null,
    FOV_RADIUS : 10,
    fovmap : [],
    discovered : [],
    
    init: function () {
        this.display = new ROT.Display({width: this.w, height: this.h, fontSize: 16});
        this.hud = new ROT.Display({width:this.w, height:1, fontSize:16});
        this.scheduler = new ROT.Scheduler.Simple();
        
        //Bind the displays
        document.getElementById("RogueCanvas").appendChild(this.display.getContainer());
        document.getElementById("RogueHUD").appendChild(this.hud.getContainer());
        
        //Generate the map and make the player.
        this.map = new ROT.Map.Digger(this.w, this.h);
        this.map.create(function(x, y, type){
            RogueJSData[x+","+y] = type;
            RogueJS.discovered[x+","+y] = 0;   //undiscovered
            //RogueJS.display.DEBUG(x, y, type);
        });        
        
        this.createPlayer();
        this.createActor();
        
        //Setup the scehduler and engine
        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
        
        //The fov
        this.fov = new ROT.FOV.PreciseShadowcasting(this.lightPasses);
        //Output callback
        recalculateMap();
        
        //Draw a bar
        drawBar(1, 0, 10, this.player._MaxHP, this.player._HP, "#0a0", "#060", "HEALTH");
    },
    
    //Drop the player in the top-left room.
    createPlayer: function(){
        var pos = FreeRoomAndPosition();
        this.player = new Player(pos[0], pos[1]);
        RogueJSEntities.push(this.player);
    }, 
    
    //Create entity
    createActor: function(){
        for(var num = 0; num < getRandom(MIN_MOBS, MAX_MOBS); num++){
            var arr = FreeRoomAndPosition();
            var x = arr[0];
            var y = arr[1];
            var entity = new Actor(x, y, "t", "#f00");
            RogueJSEntities.push(entity);
        }
        
    },
    
    //Input callback for the FOV
    lightPasses : function(x, y) {
        var key = x+","+y;
        if (key in RogueJSData) { return (RogueJSData[key] == 0); }
        return false;
    }
    
}

/**
* Drawing the FOV from the player.
* Loops through the map, wipes out all cells,
* then draws the fov, then draws entities ontop.
*/
var recalculateMap = function(){
    //Loop through entire map and reset.
    for(var y = 0; y < RogueJS.h; y++){
        for(var x = 0; x < RogueJS.w; x++){
            //Check if we have NOT discovered the tile, make it black
            if(RogueJS.discovered[x+","+y] == 0){
                RogueJS.display.draw(x, y, "", "#000", "#000");
            }else{
                var color = (RogueJSData[x+","+y] ? COLOR_DISCOVERED_WALL: COLOR_DISCOVERED_FLOOR);
                RogueJS.display.draw(x, y, "", "#fff", color);
            }
        }
    }
    
    //Recompute the fov from the player's perspective.
    RogueJS.fov.compute(RogueJS.player._x, RogueJS.player._y, RogueJS.FOV_RADIUS, function(x, y, r, visibility) {
        var ch = (r ? "" : "@");
        var color = (RogueJSData[x+","+y] ? COLOR_FOV_WALL: COLOR_FOV_FLOOR);
        RogueJS.display.draw(x, y, ch, "#fff", color);
        RogueJS.fovmap[x+","+y] = 1;
        RogueJS.discovered[x+","+y] = 1;   //now been discovered
    });
    
    for(var i = 1; i < RogueJSEntities.length; i++){
        RogueJSEntities[i]._draw();
    }
}


/**
* A method to draw a typical RPG bar, that colors partway
* over a darker color to display percentages out of a whole.
* @param posX The cell's x position
* @param posY The cell's y position
* @param width The width of the bar, in cells
* @param maxValue The maximum value the bar can hold
* @param value The current value the bar is holding
* @param colorFore The lighter foreground color
* @param colorBack The darker background (empty) color
* @param title The words to print on the bar
*/
var drawBar = function(posX, posY, width, maxValue, value, colorFore, colorBack, title){
    var startString = Math.ceil((width - title.length) / 2);
    var displayIncre = Math.floor(maxValue / width); //Get the increment amount
    var displayAmt = Math.floor((value / maxValue) * displayIncre);
    var titleFormatted = "";
    
    //Render the bar
    for(var i = 0; i < displayAmt; i++){
        RogueJS.hud.draw((posX + i), posY, null, colorBack, colorFore); //Deliberately switching colors to be clever.
        if(i >= startString){
            titleFormatted += "%c{white}%b{" + colorFore + "}" + title.charAt(i - startString)
        }
    }
    for(var i = displayAmt; i < width; i++){
        RogueJS.hud.draw((posX + i), posY, null, colorFore, colorBack); //Deliberately switching colors to be clever.
        if(i >= startString){
            titleFormatted += "%c{white}%b{" + colorBack + "}" + title.charAt(i - startString)
        }
    }
    
    //Draw the string
    RogueJS.hud.drawText(startString + posX, posY, titleFormatted);
}

/**
* Is the specified tile within the player's fov?
* @param tileX, tileY - the tile position to check
* @return true or false, if the tile is in the fovmap
*/
var IsInFOV = function(tileX, tileY){
    if(RogueJS.fovmap[tileX + "," + tileY] == 1){
        //We are in fov
        return true;
    }else{
        return false;
    }
}

//Check to see if actor is occupying spot
var IsOccupied = function(tileX, tileY){
    for(var i = 1; i < RogueJSEntities.length; i++){
        if(RogueJSEntities[i]._x == tileX && RogueJSEntities[i]._y == tileY){
            return true;
        }
    }
    return false;
}

//Find a random room
var FreeRoomAndPosition = function(){    
    var i = getRandom(0, RogueJS.map.getRooms().length);
    return RogueJS.map.getRooms()[i].getCenter();
}

function getRandom(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}
