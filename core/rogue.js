//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94

var w = 80;
var h = 25;
var display = null;
var hud = null;
var map = null;
var player = null;
var engine = null;
var fov = null;
var data = {};
var FOV_RADIUS = 10;

var RogueJS = {
    /**
    * Our constructor, for all intents and purposes.
    */
    init: function () {
        display = new ROT.Display({width: w, height: h, fontSize: 12});
        hud = new ROT.Display({width:w, height:1, fontSize:12});
        
        //Generate the map and make the player.
        map = new ROT.Map.Rogue(w, h);
        map.create(function(x, y, type){
            data[x+","+y] = type;
            display.DEBUG(x, y, type);
        });
        this.createPlayer();
        
        //Bind the displays
        document.getElementById("RogueCanvas").appendChild(display.getContainer());
        document.getElementById("RogueHUD").appendChild(hud.getContainer());
        
        //Setup the scehduler and engine
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(player, true);
        engine = new ROT.Engine(scheduler);
        engine.start();
        
        //The fov
        fov = new ROT.FOV.PreciseShadowcasting(this.lightPasses);
        //Output callback
        recalculateMap();
        
        //Draw a bar
        drawBar(1, 0, 10, player._MaxHP, player._HP, "#0a0", "#060", "HEALTH");
    },
    
    //Drop the player in the top-left room.
    createPlayer: function(){
        var room = map.rooms;
        var x = room[0][0].x + 1;
        var y = room[0][0].y + 1;
        player = new Player(x, y);
    },    
    
    //Input callback for the FOV
    lightPasses : function(x, y) {
        var key = x+","+y;
        if (key in data) { return (data[key] == 0); }
        return false;
    }
    
}

/**
* Drawing the FOV from the player
*/
var recalculateMap = function(){
    //Loop through entire map and reset.
    for(y in map.map){
        for(x in map.map){
            display.draw(x, y, map[x + "," + y]);   //Reset the tile.
        }
    }    
    
    //Recompute the fov from the player's perspective.
    fov.compute(player._x, player._y, FOV_RADIUS, function(x, y, r, visibility) {
        var ch = (r ? "" : "@");
        var color = (data[x+","+y] ? "#555": "#333");
        display.draw(x, y, ch, "#fff", color);
    });
}


//Drawing a value bar
var drawBar = function(posX, posY, width, maxValue, value, colorFore, colorBack, title){
    var startString = Math.ceil((width - title.length) / 2);
    var displayIncre = Math.floor(maxValue / width); //Get the increment amount
    var displayAmt = Math.floor((value / maxValue) * displayIncre);
    var titleFormatted = "";
    
    //Render the bar
    for(var i = 0; i < displayAmt; i++){
        hud.draw((posX + i), posY, null, colorBack, colorFore); //Deliberately switching colors to be clever.
        if(i >= startString){
            titleFormatted += "%c{white}%b{" + colorFore + "}" + title.charAt(i - startString)
        }
    }
    for(var i = displayAmt; i < width; i++){
        hud.draw((posX + i), posY, null, colorFore, colorBack); //Deliberately switching colors to be clever.
        if(i >= startString){
            titleFormatted += "%c{white}%b{" + colorBack + "}" + title.charAt(i - startString)
        }
    }
    
    //Draw the string
    hud.drawText(startString + posX, posY, titleFormatted);
}

//Defining a player
var Player = function(x, y){
    this._x = x;
    this._y = y;
    this._MaxHP = 100;
    this._HP = this._MaxHP;
    this._draw();
}

//The player's drawing function
Player.prototype._draw = function(){
    display.draw(this._x, this._y, "@", "#fff");
}

//The function that the engine will be calling by default
Player.prototype.act = function(){
    //Lockup the engine to await user input
    engine.lock();
    //Await user input on the player object - must have handleEvent function.
    window.addEventListener("keydown", this); 
}

//Handle user input
Player.prototype.handleEvent = function(e){
    var keyMap = {};    //Standard key mappings
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;
    
    var code = e.keyCode;
    
    if(!(code in keyMap)) { return; }  //Return nothing if the key is invalid
    
    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];
    
    if (data[newX+","+newY] == 1){ return;} //Cannot move there
    
    display.draw(this._x, this._y, map[this._x + "," + this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    //Clear the event listener and unlock the engine
    window.removeEventListener("keydown", this);
    engine.unlock();
    recalculateMap();
}