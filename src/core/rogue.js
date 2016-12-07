//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94
var RogueJSData = {};
var Entities = [];
var Messages = [];

var COLOR_FOV_WALL = '#b37700';
var COLOR_FOV_FLOOR = '#664400';
// var COLOR_FOV_WALL = Colors.base02;
// var COLOR_FOV_FLOOR = Colors.base03;
var COLOR_DISCOVERED_WALL = '#222';
var COLOR_DISCOVERED_FLOOR = '#111';

var COLOR_HEALTH_DARK = '#2e4200';
var COLOR_HEALTH_LIGHT = Colors.green;

var COLOR_XP_DARK = '#4d004d';
var COLOR_XP_LIGHT = '#800080';

var MIN_MOBS = 3;
var MAX_MOBS = 5;

var MIN_ITEMS = 2;
var MAX_ITEMS = 5;

var RogueJS = {    
    w : 115,
    h : 28,
    display : null,
    hud : null,
    msgLog: null,
    map : null,
    player : null,
    engine : null,
    fov : null,
    scheduler: null,
    FOV_RADIUS : 5,
    fovmap : [],
    discovered : [],
    level: 1,
    
    init: function () {
        this.display = new ROT.Display({width: this.w, height: this.h, fontSize: 16});
        this.hud = new ROT.Display({width:this.w, height:1, fontSize:16});
        this.msgLog = new ROT.Display({width: this.w, height: 5, fontSize: 16});
        this.scheduler = new ROT.Scheduler.Simple();
        
        //Bind the displays
        document.getElementById("RogueCanvas").appendChild(this.display.getContainer());
        document.getElementById("RogueHUD").appendChild(this.hud.getContainer());
        document.getElementById("RogueMessages").appendChild(this.msgLog.getContainer());
        
        //The fov
        this.fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
        
        //Make the first level
        this.makeLevel(1);
        MessageLog("Welcome to the Dungeons of %c{red}DOOM%c{}!");
        
        //Setup the scehduler and engine
        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
        
        //Output callback
        recalculateMap();
        
        //Update the HUD
        UpdateHUD();
    },
    
    //Drop the player in the top-left room.
    createPlayer: function(){
        var pos = RoomAndPosition();
        if(!this.player){
            this.player = new Player(pos[0], pos[1]);
            Entities.push(this.player);
        }else{
            this.player._x = pos[0];
            this.player._y = pos[1];
        }
    }, 
    
    //Create entities in the map
    createActors: function(level){
        for(var num = 0; num < getRandom(MIN_MOBS, MAX_MOBS); num ++){
            var arr = RoomAndPosition();
            
            //Check the room isn't occupied.
            if(!IsOccupied(arr[0], arr[1])){
                var targetLevel = level - 1; //0-index array
                var r = getRandom(0, monsters[targetLevel].length);
                
                //Create the entity according to the data file.
                var entity = new Actor(arr[0], arr[1], 
                                       monsters[targetLevel][r].char, 
                                       monsters[targetLevel][r].color, 
                                       monsters[targetLevel][r].name, 
                                       monsters[targetLevel][r].maxHP,
                                       monsters[targetLevel][r].XP,
                                       monsters[targetLevel][r].weapon);
                                
                Entities.push(entity);
            }          
        }  
    },

    //Create items in the map
    createItems: function(level){
        for(var num = 0; num < getRandom(MIN_ITEMS, MAX_ITEMS); num ++){
            var arr = RoomAndPosition();
            
            //Check the room isn't occupied.
            if(!IsOccupied(arr[0], arr[1])){
                var targetLevel = level - 1; //0-index array
                var r = getRandom(0, items[targetLevel].length);
                
                //Create the entity according to the data file.
                var entity = new Item(arr[0], arr[1], 
                                       items[targetLevel][r].name, 
                                       items[targetLevel][r].char, 
                                       items[targetLevel][r].color, 
                                       items[targetLevel][r].ability);
                                
                Entities.push(entity);
            }          
        }  
    },
    
    //Create the weapons.
    createWeapons : function(){

    },

    placeStairs: function(){
        var Stairs = new Item("Stairs", '>', '#fff', RogueJS.nextLevel);
        Entities.push(Stairs);
    },

    nextLevel: function(){
        this.level += 1;
        MessageLog("You advance to the next level...");
        this.makeLevel();
    },

    makeLevel : function(level){
        //Generate the map and make the player.
        this.map = new ROT.Map.Digger(this.w, this.h, {
            roomWidth: [5, 10], /* room minimum and maximum width */
            roomHeight: [5, 10], /* room minimum and maximum height */
            corridorLength: [3, 4], /* corridor minimum and maximum length */
            dugPercentage: 0.40, /* we stop after this percentage of level area has been dug out */
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        });
        this.map.create(function(x, y, type){
            RogueJSData[x+","+y] = type;
            RogueJS.discovered[x+","+y] = 0;   //undiscovered
        });        
    
        this.placeStairs();
        this.createItems(level);
        this.createActors(level);
        this.createPlayer();
    },

    useItem: function(tileX, tileY, actor){
        var item = checkUnderFoot(tileX, tileY);
        if(item){
            item.useAbility(actor);
            MessageLog(actor.getName() + " uses the %c{#b37700}" + item.getName() + "%c{}!");

            var x = Entities.indexOf(item);
            RogueJS.scheduler.remove(item);
            Entities.splice(x, 1);   //Remove from the array
        }else{
            MessageLog("There's nothing here.");
        }
    },

    postmortem: function(){
        RogueJS.engine.lock();

        for(var i = 0; i < 10; i++){
            //TODO: Implement proper pushing of timeouts to a timeout array and clear that array
            clearTimeout(i);
        }

        //Wipe everything
        this.display.clear();
        this.scheduler = null;
        this.RogueJSData = null;
        this.Entities = null;

        var endPlayer = {
            name: this.player.getName(),
            maxHP: this.player.getMaxHP()
        };

        this.player = null;

        document.getElementById("RogueHUD").style.display = "none";

        this.display.drawText(5,  2, "You have %c{red}perished%c{} on level " + this.level);
        this.display.drawText(5,  5, "Your name was " + endPlayer.name + " and you had a Max HP of " + endPlayer.maxHP + ".");

        this.display.drawText(5,  25, "Refresh your browser to play again.");

        this.engine = null;
    }
    
};

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
    
    //Reset the fov
    RogueJS.fovmap = [];

    //Recompute the fov from the player's perspective.
    if(RogueJS.player){
        RogueJS.fov.compute(RogueJS.player._x, RogueJS.player._y, RogueJS.FOV_RADIUS, function(x, y, r, visibility) {
            var ch = (r ? "" : "@");
            var color = (RogueJSData[x+","+y] ? COLOR_FOV_WALL: COLOR_FOV_FLOOR);
            RogueJS.display.draw(x, y, ch, "#fff", color);
            RogueJS.fovmap[x+","+y] = 1;
            RogueJS.discovered[x+","+y] = 1;   //now been discovered
        });
    }
    
    for(var i = 1; i < Entities.length; i++){
        Entities[i]._draw();
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
    var displayAmt = Math.floor((value / maxValue) * width);
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
    if(RogueJS.fovmap[tileX + "," + tileY] === 1){
        //We are in fov
        return true;
    }else{
        return false;
    }
}

//Check to see if actor or player is occupying spot
var IsOccupied = function(tileX, tileY){
    if(RogueJS.player && RogueJS.player.getX() == tileX && RogueJS.player.getY() == tileY){
        return true;
    }
    for(var i = 1; i < Entities.length; i++){
        if(Entities[i]._x == tileX && Entities[i]._y == tileY && Entities[i] instanceof Actor){
            return true;
        }
    }
    return false;
}

//Find a random room
var RoomAndPosition = function(){    
    var i = getRandom(0, RogueJS.map.getRooms().length);
    return RogueJS.map.getRooms()[i].getRandomPosition();
}

function getRandom(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

//Returns the Entity (or player) at the tile specified.
function GetObjectAtTile(tileX, tileY){
    if(RogueJS.player.getX() == tileX && RogueJS.player.getY() == tileY){
        return RogueJS.player;
    }
    for(var i = 1; i < Entities.length; i++){
        if(Entities[i]._x == tileX && Entities[i]._y == tileY){
            return Entities[i];
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
        MessageLog(msg);
        
        //Check for death
        if(defender.isDead()){
            if(defender instanceof Actor){   //is not the player
                var x = Entities.indexOf(defender);
                RogueJS.scheduler.remove(defender);
                //Gain experience
                RogueJS.player.gainXP(defender.getXP());
                Entities.splice(x, 1);   //Remove from the array
                recalculateMap();
                var msg = "The " + defender.getName() + " %c{red}is dead!";
                MessageLog(msg);
            }
        }       
    }else{
        //Ain't nothing to attack there.
        return;
    }
}

//Check if anything's under foot
function checkUnderFoot(tileX, tileY){
    if(RogueJS.player){
        for(var i = 1; i < Entities.length; i++){
            if(Entities[i]._x == tileX && Entities[i]._y == tileY && Entities[i] instanceof Item){
                return Entities[i];
            }
        }
    }
    return false;
}

/**
* Update the HUD Message.
*/
function MessageLog(str){
    Messages.unshift(str);

    //Draw the log
    RogueJS.msgLog.clear();
    
    if(Messages.length > 5){
        Messages.splice(5, Messages.length - 5);
    }

    for (var i = 0; i < Messages.length; i++) {
        RogueJS.msgLog.drawText(1, i, Messages[i]);
    }

    
}

/**
* Update the HUD with the player's stats
* and most recent message.
*/
function UpdateHUD(){
    //Wipe out the display
    RogueJS.hud.clear();
    
    //Show player's status
    if(RogueJS.player){
        curHealth = "HP (" + RogueJS.player.getHP() + "/" + RogueJS.player.getMaxHP() + ")";
        drawBar(1, 0, 12, RogueJS.player.getMaxHP(), RogueJS.player.getHP(), COLOR_HEALTH_LIGHT, COLOR_HEALTH_DARK, curHealth);

        curXP = "XP (" + RogueJS.player.getXP() + "/" + RogueJS.player.getNextXP() + ")";
        drawBar(15, 0, 12, RogueJS.player.getNextXP(), RogueJS.player.getXP(), COLOR_XP_LIGHT, COLOR_XP_DARK, curXP);
    }

    //Refresh.
    setTimeout(UpdateHUD, 1500);
}

/**
 * Callback for FOV checking.
 */
function lightPasses(x, y) {
    var key = x+","+y;
    if (key in RogueJSData) { return (RogueJSData[key] == 0); }
    return false;
}