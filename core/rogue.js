//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94
var RogueJSData = {};
var RogueJSEntities = [];

var COLOR_FOV_WALL = "#555";
var COLOR_FOV_FLOOR = "#333";
var RogueJS = {    
    w : 80,
    h : 25,
    display : null,
    hud : null,
    map : null,
    player : null,
    engine : null,
    fov : null,
    scheduler: null,
    FOV_RADIUS : 10,
    fovmap : [],
    
    /**
    * Our constructor, for all intents and purposes.
    */
    init: function () {
        this.display = new ROT.Display({width: this.w, height: this.h, fontSize: 12});
        this.hud = new ROT.Display({width:this.w, height:1, fontSize:12});
        this.scheduler = new ROT.Scheduler.Simple();
        
        //Generate the map and make the player.
        this.map = new ROT.Map.Rogue(this.w, this.h);
        this.map.create(function(x, y, type){
            RogueJSData[x+","+y] = type;
        });
        this.createPlayer();
        this.createActor();
        
        //Bind the displays
        document.getElementById("RogueCanvas").appendChild(this.display.getContainer());
        document.getElementById("RogueHUD").appendChild(this.hud.getContainer());
        
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
        var room = this.map.rooms;
        var x = room[0][0].x + 1;
        var y = room[0][0].y + 1;
        this.player = new Player(x, y);
        RogueJSEntities.push(this.player);
    }, 
    
    //Create entity
    createActor: function(){
        var room = this.map.rooms;
        var x = room[0][0].x + 5;
        var y = room[0][0].y + 1;
        var entity = new Actor(x, y, "t", "#f00");
        RogueJSEntities.push(entity);
    },
    
    //Input callback for the FOV
    lightPasses : function(x, y) {
        var key = x+","+y;
        if (key in RogueJSData) { return (RogueJSData[key] == 0); }
        return false;
    }
    
}

/**
* Drawing the FOV from the player
*/
var recalculateMap = function(){
    //Loop through entire map and reset.
    for(y in RogueJS.map.map){
        for(x in RogueJS.map.map){
            RogueJS.display.draw(x, y, RogueJS.map[x + "," + y]);   //Reset the tile.
            RogueJS.fovmap[x+","+y] = 0;
        }
    }    
    
    //Recompute the fov from the player's perspective.
    RogueJS.fov.compute(RogueJS.player._x, RogueJS.player._y, RogueJS.FOV_RADIUS, function(x, y, r, visibility) {
        var ch = (r ? "" : "@");
        var color = (RogueJSData[x+","+y] ? COLOR_FOV_WALL: COLOR_FOV_FLOOR);
        RogueJS.display.draw(x, y, ch, "#fff", color);
        RogueJS.fovmap[x+","+y] = 1;
    });
    
    for(var i = 1; i < RogueJSEntities.length; i++){
        RogueJSEntities[i]._draw();
    }
}


//Drawing a value bar
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

//Is this tile in the FOV?
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