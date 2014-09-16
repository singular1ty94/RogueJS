//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94
var RogueJSData = {};
var RogueJSEntities = [];
var RogueJSMessages = ["Welcome to the Dungeons of %c{red}DOOM%c{}!"];

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
    monsters : null,
    level: 1,
    
    init: function () {
        this.display = new ROT.Display({width: this.w, height: this.h, fontSize: 16});
        this.hud = new ROT.Display({width:this.w, height:1, fontSize:16});
        this.scheduler = new ROT.Scheduler.Simple();
        
        //Read in the monters file.
        try{
            this.monsters = eval(monsters);
        }catch(err){
            console.log("[FATAL] Can't read enemies.");
        }
        
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
        
        //Update the HUD
        UpdateHUD();
    },
    
    //Drop the player in the top-left room.
    createPlayer: function(){
        var pos = FreeRoomAndPosition();
        this.player = new Player(pos[0], pos[1]);
        RogueJSEntities.push(this.player);
    }, 
    
    //Create entity
    createActor: function(){
        for(var num = 0; num < getRandom(MIN_MOBS, MAX_MOBS); num ++){
            var arr = FreeRoomAndPosition();    //Get the center of a room.
            
            //Check the room isn't occupied.
            if(!IsOccupied(arr[0], arr[1])){
                //Get a random monster that's suitable for this level.
                var r = getRandom(0, this.monsters[this.level - 1].length);
                
                //Create the entity according to the data file.
                var entity = new Actor(arr[0], arr[1], 
                                       this.monsters[this.level-1][r].char, 
                                       this.monsters[this.level-1][r].color, 
                                       this.monsters[this.level-1][r].name, 
                                       this.monsters[this.level-1][r].maxHP,
                                       this.monsters[this.level-1][r].weapon);
                
                //Push it to the list of all entities.
                RogueJSEntities.push(entity);
            }          
        }  
    },
    
    //Create the weapons.
    createWeapons : function(){

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

//Check to see if actor or player is occupying spot
var IsOccupied = function(tileX, tileY){
    if(RogueJS.player.getX() == tileX && RogueJS.player.getY() == tileY){
        return true;
    }
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

//Returns the Entity (or player) at the tile specified.
function GetObjectAtTile(tileX, tileY){
    if(RogueJS.player.getX() == tileX && RogueJS.player.getY() == tileY){
        return RogueJS.player;
    }
    for(var i = 1; i < RogueJSEntities.length; i++){
        if(RogueJSEntities[i]._x == tileX && RogueJSEntities[i]._y == tileY){
            return RogueJSEntities[i];
        }
    }
    return;
}

/**
* Handles one object (like an actor or player) 
* attacking another tile co-ordinates. These tile co-ords
* resolve into an entity, and then damage is dealt according
* to getDamage(), damageHP(), isDead() and instanceof Actor/Player
* @param attacker The attacker, likely the player or an Actor
* @param tileX The x coord to attack
* @param tileY The y coord to attack
*/
function attackTile(attacker, tileX, tileY){
    //First, determine if there is actually an enemy there.
    if(IsOccupied(tileX, tileY)){
        //There's something occupying that cell (assume it's attackable).
        var defender = GetObjectAtTile(tileX, tileY);
        
        //Attacker deals damage to defender.
        defender.damageHP(attacker.getDamage());
        var msg = attacker.getName() + " attacks " + defender.getName() + " for " + attacker.getDamage() + " %c{red}damage!";
        HUDMessage(msg);
        
        //Check for death
        if(defender.isDead()){
            if(defender instanceof Actor){   //is not the player
                var x = RogueJSEntities.indexOf(defender);
                RogueJS.scheduler.remove(defender);
                RogueJSEntities.splice(x, 1);   //Remove from the array
                recalculateMap();
                var msg = "The " + defender.getName() + " %c{red}is dead!";
                HUDMessage(msg);
            }else if(defender instanceof Player){
                //GameOver();
            }
        }       
    }else{
        //Ain't nothing to attack there.
        return;
    }
}

/**
* Update the HUD Message.
*/
function HUDMessage(str){
    RogueJSMessages.push(str);
    UpdateHUD();
}

/**
* Update the HUD with the player's stats
* and most recent message.
*/
function UpdateHUD(){
    //Wipe out the display
    RogueJS.hud.clear();
    
    //Show player's health
    drawBar(1, 0, 10, RogueJS.player.getMaxHP(), RogueJS.player.getHP(), "#0a0", "#060", "HEALTH");
    
    //Pop the most recent message
    RogueJS.hud.drawText(16, 0, RogueJSMessages.pop());
    
    //Refresh.
    setTimeout(UpdateHUD, 1500);
}
