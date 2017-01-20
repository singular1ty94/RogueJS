//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94
var RogueJSData = {};
var RogueJSLight = {};
var Entities = [];
var Messages = [];

var MIN_MOBS = 6;
var MAX_MOBS = 13;

var MIN_ITEMS = 5;
var MAX_ITEMS = 10;

var CHANCE_RARE = 5;
var CHANCE_UNCOMMON = 15;
var CHANCE_COMMON = 25;
var CHANCE_FREQUENT = 35;

var RogueJS = {    
    w : 93,
    h : 28,
    display : null,
    hud : null,
    msgLog: null,
    map : null,
    player : null,
    engine : null,
    fov : null,
    lighting: null,
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

        document.getElementById("RogueCanvas").addEventListener("click", canvasClick);
        
        //The fov
        this.fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
        this.lighting = new ROT.Lighting(reflectivity, {range: this.FOV_RADIUS + 1, passes:1});
        this.lighting.setFOV(this.fov);
        
        //Make the first level
        this.makeLevel(this.level);
        MessageLog("Welcome to the %c{red}Rogue's Dungeon%c{}!");

        // this.lighting.setLight(RogueJS.player.getX(), RogueJS.player.getY(), [240, 240, 30]);
        this.lighting.compute(lightingCallback);

        //Setup the scehduler and engine
        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
        
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
            Entities.push(this.player);
            RogueJS.scheduler.add(this.player, true);
        }
    }, 
    
    /**
     * Create Monsters in the map. 
     *
     * Using identical rarity logic to the item generation.
     */
    createMonsters: function(level){
        var mobsToPlace = getRandom(MIN_MOBS, MAX_MOBS);
        var mobsPlaced = 0;
        while(mobsPlaced < mobsToPlace){
            for (var i = 0, len = monsters.length; i < len; i++) {
                var monster = monsters[i];
                var place = false;

                var chance = ROT.RNG.getPercentage();

                if(!place && monster.weighting.rare && (level >= monster.weighting.rare[0] && level <= monster.weighting.rare[1])){ 
                    if(chance <= CHANCE_RARE){ place = true; } 
                }
                if(!place && monster.weighting.uncommon && (level >=monster.weighting.uncommon[0] && level <= monster.weighting.uncommon[1])){ 
                    if(chance <= CHANCE_UNCOMMON){ place = true; } 
                }
                if(!place && monster.weighting.common && (level >= monster.weighting.common[0] && level <= monster.weighting.common[1])){ 
                    if(chance <= CHANCE_COMMON){ place = true; } 
                }
                if(!place && monster.weighting.frequent && (level >= monster.weighting.frequent[0] && level <= monster.weighting.frequent[1])){ 
                    if(chance <= CHANCE_FREQUENT){ place = true; } 
                }

                if(place){
                    var arr = RoomAndPosition();
                
                    //Check the room isn't occupied.
                    if(!IsOccupied(arr[0], arr[1])){                     
                        //Create the entity according to the data file.
                        var entity = new Actor(arr[0], arr[1], 
                                            monster.char, 
                                            monster.color, 
                                            monster.name,
                                            monster.maxHP,
                                            monster.XP,
                                            monster.range,
                                            monster.weapon);
                                        
                        Entities.push(entity);
                        mobsPlaced++;
                    }          
                }
            }
        }
        
    },

    /**
     * Create Items in the map. 
     *
     * We're guaranteed a certain number of items per map via the MIN_ITEMS, MAX_ITEMS variable.
     * Loop through until we've managed to place a random between MIN and MAX.
     * 
     * For each iteration, look at each item in the Items array.
     * Check its weighting (if one exists) and identify that our current dungeon level applies.
     * 
     * From a random chance variable, see if we can place at this rarity. If we can't, keep checking
     *      more frequent rarities if they exist.
     * 
     * Then find a room and place this item.
     */
    createItems: function(level){
        var itemsToPlace = getRandom(MIN_ITEMS, MAX_ITEMS);
        var itemsPlaced = 0;
        while(itemsPlaced < itemsToPlace){
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var place = false;

                var chance = ROT.RNG.getPercentage();

                if(!place && item.weighting.rare && (level >= item.weighting.rare[0] && level <= item.weighting.rare[1])){ 
                    console.log(item.name + " / rare / " + chance); 
                    if(chance <= CHANCE_RARE){ place = true; } 
                }
                if(!place && item.weighting.uncommon && (level >= item.weighting.uncommon[0] && level <= item.weighting.uncommon[1])){
                    console.log(item.name + " / uncommon / " + chance); 
                    if(chance <= CHANCE_UNCOMMON){ place = true; } 
                }
                if(!place && item.weighting.common && (level >= item.weighting.common[0] && level <= item.weighting.common[1])){
                    console.log(item.name + " / common / " + chance); 
                    if(chance <= CHANCE_COMMON){ place = true; } 
                }
                if(!place && item.weighting.frequent && (level >= item.weighting.frequent[0] && level <= item.weighting.frequent[1])){ 
                    console.log(item.name + " / frequent / " + chance); 
                    if(chance <= CHANCE_FREQUENT){ place = true; } 
                }

                if(place){
                    var arr = RoomAndPosition();
                
                    //Check the room isn't occupied.
                    if(!IsOccupied(arr[0], arr[1])){                     
                        //Create the entity according to the data file.
                        var entity = new Item(arr[0], arr[1], 
                                            item.name, 
                                            item.char, 
                                            item.color, 
                                            item.ability);
                                        
                        Entities.push(entity);
                        itemsPlaced++;
                    }          
                }
            }
        }
        
    },

    /**
     * Stairs are guaranteed to be placed somewhere in the level.
     * 
     * They are essentially a single-use item that triggers the next level.
     */
    placeStairs: function(){
        var arr = RoomAndPosition();
        if(!IsOccupied(arr[0], arr[1])){
            var Stairs = new Item(arr[0], arr[1], "Stairs", ">", Colors.WHITE, RogueJS.nextLevel);
            Entities.push(Stairs);
            return;
        } else {
            RogueJS.placeStairs();
        }      
    },

    /**
     * Load the next level of the dungeon.
     */
    nextLevel: function(){
        //Using RogueJS scope due to weird issues with using this as callback to stairs ability
        RogueJS.engine.lock();

        Entities = [];
        RogueJS.scheduler.clear();

        RogueJS.level = RogueJS.level + 1;
        MessageLog("You advance to %c{red}Level " + RogueJS.level + "%c{}...");
        RogueJS.makeLevel(RogueJS.level);
    },

    /**
     * Make a new dungeon level and populate it with items, monsters and player.
     * @param level The level of the dungeon.
     */
    makeLevel : function(level){
        //Clear the display
        this.display.clear();

        //Generate the map and make the player.
        this.map = new ROT.Map.Uniform(this.w, this.h, {
            roomWidth: [5, 10], /* room minimum and maximum width */
            roomHeight: [5, 10], /* room minimum and maximum height */
            roomDugPercentage: 0.90, /* we stop after this percentage of level area has been dug out */
            timeLimit: 5000 /* we stop after this much time has passed (msec) */
        });
        this.map.create(function(x, y, type){
            RogueJSData[x+","+y] = type;
            RogueJS.discovered[x+","+y] = 0;   //undiscovered
        });        
    
        this.createItems(level);
        this.placeStairs();
        this.createMonsters(level);
        this.createPlayer(); 

        recalculateMap();

        if(this.engine) { this.engine.unlock(); }
    },

    useItem: function(tileX, tileY, actor){
        var item = checkUnderFoot(tileX, tileY);
        if(item){
            var x = Entities.indexOf(item);
            RogueJS.scheduler.remove(item);
            Entities.splice(x, 1);   //Remove from the array

            item.useAbility(actor);
            MessageLog(actor.getName() + " uses the %c{"+Colors.ORANGE_GOLD+"}" + item.getName() + "%c{}!");
        }else{
            MessageLog("There's nothing here.");
        }
    },

    postmortem: function(){
        RogueJS.engine.lock();

        for(var i = 0; i < 99; i++){
            //TODO: Implement proper pushing of timeouts to a timeout array and clear that array
            clearTimeout(i);
        }

        //Wipe everything
        this.display.clear();
        this.hud.clear();
        this.msgLog.clear();
        this.scheduler.clear();

        RogueJSData = {};
        RogueJSLight = {};
        Entities = [];
        Messages = [];

        var endPlayer = {
            name: this.player.getName(),
            maxHP: this.player.getMaxHP()
        };

        this.player = null;

        $("#game-container").css("display", "none");
        $("#end-container").css("display", "block");

        // document.getElementById("RogueHUD").style.display = "none";

        // this.display.drawText(5,  2, "You have %c{red}perished%c{} on level " + this.level);
        // this.display.drawText(5,  5, "You had a Max HP of " + endPlayer.maxHP + ".");

        // this.display.drawText(5,  25, "Refresh your browser to play again.");

        this.engine = null;
    }
    
};

/**
* Drawing the FOV from the player.
* Loops through the map, wipes out all cells,
* then draws the fov, then draws entities ontop.
*/
var recalculateMap = function(){
    if(RogueJS.player){
        //Loop through entire map and reset.
        for(var y = 0; y < RogueJS.h; y++){
            for(var x = 0; x < RogueJS.w; x++){
                //Check if we have NOT discovered the tile, make it black
                if(RogueJS.discovered[x+","+y] == 0){
                    RogueJS.display.draw(x, y, "",  Colors.BLACK, Colors.BLACK);
                }
            }
        }

        //Reset the lights
        RogueJS.lighting.clearLights();
        RogueJS.lighting.setLight(RogueJS.player.getX(), RogueJS.player.getY(), [240, 240, 30]);
        RogueJS.lighting.compute(lightingCallback);
        
        //Reset the fov
        RogueJS.fovmap = [];

        //Recompute the fov from the player's perspective.
        if(RogueJS.player){
            RogueJS.fov.compute(RogueJS.player._x, RogueJS.player._y, RogueJS.FOV_RADIUS, function(x, y, r, visibility) {
                var ch = (r ? "" : "@");
                var color = (RogueJSData[x+","+y] ? Colors.FOV_WALL: Colors.FOV_FLOOR);
                RogueJS.display.draw(x, y, ch, Colors.WHITE, color);

                RogueJS.fovmap[x+","+y] = 1;
                RogueJS.discovered[x+","+y] = 1;   //now been discovered

                var ambientLight = [100, 100, 100];

                    var baseColor = (RogueJSData[x+","+y] ? [100, 100, 100] : [50, 50, 50]);
                    var light = ambientLight;

                    if ([x+","+y] in RogueJSLight) { /* add light from our computation */
                        light = ROT.Color.add(light, RogueJSLight[x+","+y]);
                    }

                    var finalColor = ROT.Color.multiply(baseColor, light);
                    RogueJS.display.draw(x, y, null, null, ROT.Color.toRGB(finalColor));
            });
        }

        //Appropriately draw the entities
        for(var i = 0; i < Entities.length; i++){
            Entities[i]._draw();
        }

        UpdateHUD();
    }
    
}


/**
* A method to draw a typical RPG bar, that colors partway
* over a darker color to display percentages out of a whole.
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
    for(var i = 0; i < Entities.length; i++){
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
    for(var i = 0; i < Entities.length; i++){
        if(Entities[i]._x == tileX && Entities[i]._y == tileY){
            return Entities[i];
        }
    }
    return;
}

//Returns the Enemy at the tile
function GetEnemyAtTile(tileX, tileY){
    for(var i = 0; i < Entities.length; i++){
        if(Entities[i]._x == tileX && Entities[i]._y == tileY && (Entities[i] instanceof Actor || Entities[i] instanceof Player)){
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
*/
function attackTile(attacker, tileX, tileY){
    //First, determine if there is actually an enemy there.
    if(IsOccupied(tileX, tileY)){
        //There's something occupying that cell (assume it's attackable).
        var defender = GetEnemyAtTile(tileX, tileY);
        
        //Attacker deals damage to defender.
        defender.damageHP(attacker.getDamage());
        var msg = attacker.getName() + " attacks " + defender.getName() + " for " + attacker.getDamage() + " %c{red}damage!";
        MessageLog(msg);

        //Random blood splatter! 60% chance
        if(getRandom(0, 100) <= 60){
            bloodSplatter(tileX, tileY, getRandom(0, 7));
        }
        
        //Check for death
        if(defender.isDead()){
            if(defender instanceof Actor){ 
                //Destroy the actor
                var x = Entities.indexOf(defender);
                RogueJS.scheduler.remove(defender);
                Entities.splice(x, 1);   //Remove from the array

                //Gain experience for the player
                RogueJS.player.gainXP(defender.getXP());

                //Leave a corpse.
                var corpse = new Item(defender.getX(), defender.getY(), "Bloody Corpse", "%", Colors.BLOOD, ABILITY_NOTHING);
                Entities.unshift(corpse);
                
                //Finish up
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

//Splatter some blood.
/**
 * 0 1 2
 * 7 . 3
 * 6 5 4
 */
function bloodSplatter(tileX, tileY, direction){
    if(GetObjectAtTile(tileX, tileY).getName() != "Blood"){
        dirs = [];
        switch(direction){
            case 0: dirs = [tileX - 1, tileY - 1]; break;
            case 1: dirs = [tileX, tileY - 1]; break;
            case 2: dirs = [tileX + 1, tileY - 1]; break;
            case 3: dirs = [tileX + 1, tileY]; break;
            case 4: dirs = [tileX + 1, tileY + 1]; break;
            case 5: dirs = [tileX, tileY + 1]; break;
            case 6: dirs = [tileX - 1, tileY + 1]; break;
            case 7: dirs = [tileX - 1, tileY]; break;
        }
        var blood = new Item(dirs[0], dirs[1], "Blood", "", Colors.BLOOD, ABILITY_NOTHING);
        Entities.unshift(blood);
    }
}

/**
 * Return all neighbors in a concentric ring
 * @param {int} cx center-x
 * @param {int} cy center-y
 * @param {int} r range
 */
function getCircle(cx, cy, r) {
	var result = [];
	var dirs, countFactor, startOffset;
    dirs = ROT.DIRS[4];
    countFactor = 2;
    startOffset = [-1, 1];
	
	/* starting neighbor */
	var x = cx + startOffset[0]*r;
	var y = cy + startOffset[1]*r;

	/* circle */
	for (var i=0;i<dirs.length;i++) {
		for (var j=0;j<r*countFactor;j++) {
			result.push([x, y]);
			x += dirs[i][0];
			y += dirs[i][1];

		}
	}

	return result;
}

function bloomEffect(tileX, tileY, radius, colour){
    //Leverage the FOV circular computation.
    bloomTiles = getCircle(tileX, tileY, radius);
    for(var i = 0; i < bloomTiles.length; i++){
        RogueJS.display.draw(bloomTiles[i][0], bloomTiles[i][1], "", Colors.WHITE, colour);
    }
    try {
        RogueJS.engine.lock();
        setTimeout(tryUnlock, 100)
    } catch (err) { }
}

function tryUnlock(){
    try{
        RogueJS.engine.unlock();
    }catch(err){ }
}

//Check if anything's under foot
function checkUnderFoot(tileX, tileY){
    if(RogueJS.player){
        for(var i = 0; i < Entities.length; i++){
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
    // HP bar       Xp bar               Weapon bar                     Stats
    // ------------ -------------------- ----------------------------  ----->>>
    // =HP=(46/74)= =XP=(34/223)=|=Lv=5= =Adequate=Battle-Axe=(17=dmg) HP+ ATK+
    //
    if(RogueJS.player){
        curHealth = "HP (" + RogueJS.player.getHP() + "/" + RogueJS.player.getMaxHP() + ")";
        curHealthWidth = curHealth.length + 2;
        drawBar(1, 0, curHealthWidth, RogueJS.player.getMaxHP(), RogueJS.player.getHP(), Colors.HEALTH_LIGHT, Colors.HEALTH_DARK, curHealth);

        curXP = "XP (" + RogueJS.player.getXP() + "/" + RogueJS.player.getNextXP() + ") | Lv " + RogueJS.player.getLevel();
        curXPWidth = curXP.length + 2;
        drawBar(curHealthWidth + 2, 0, curXPWidth, RogueJS.player.getNextXP(), RogueJS.player.getXP(), Colors.XP_LIGHT, Colors.XP_DARK, curXP);

        curWeapon = RogueJS.player._weapon.getName() + " " + "(" + RogueJS.player._weapon.getDamage() + " dmg)";
        curWeaponWidth = curWeapon.length + 2;
        drawBar(curHealthWidth + curXPWidth + 3, 0, curWeaponWidth, 1, 1, Colors.ORANGE_GOLD, Colors.ORANGE_GOLD, curWeapon);

        passive = "";
        for(var i = 0; i < RogueJS.player.getPassives().length; i++){
            passive = passive + RogueJS.player.getPassives()[i].symbol + " ";
        }
        RogueJS.hud.drawText(curHealthWidth + curXPWidth + curWeaponWidth + 4, 0, passive);
    }
}

/**
 * Callback for FOV checking.
 */
function lightPasses(x, y) {
    var key = x+","+y;
    if (key in RogueJSData) { return (RogueJSData[key] == 0); }
    return false;
}

/* prepare a lighting algorithm */
function reflectivity(x, y) {
    return (RogueJSData[x+","+y] == 1 ? 0.3 : 0);
}

var lightingCallback = function(x, y, color) {
    RogueJSLight[x+","+y] = color;
}

/**
 * Call the canvas flash effect for levelups.
 */
function flashScreen(){
    $("#RogueFlash").show();
    $("#RogueFlash").addClass("flash");
    $("#RogueCanvas").hide();
    
    setTimeout( function(){
        $("#RogueFlash").removeClass("flash");
        $("#RogueFlash").hide();
        $("#RogueCanvas").show();
    }, 250);	// Timeout must be the same length as the CSS3 transition or longer (or you'll mess up the transition)
}


/**
 * Handle the user clicking on the display canvas.
 */
function canvasClick(e){
    var pos = RogueJS.display.eventToPosition(e);
    var object = GetObjectAtTile(pos[0], pos[1]);

    if (object && IsInFOV(pos[0], pos[1])){
        MessageLog("You see a %c{#007dcc}" + object.getName() + "%c{}.");
    } else if (!object && IsInFOV(pos[0], pos[1])){
        MessageLog("There's nothing there.");
    } else if (!IsInFOV(pos[0], pos[1])) {
        MessageLog("You can't see there.");
    }
}

/**
 * Start the game.
 */
function startGame(){
    $("#game-container").css("display", "block");
    $("#start-container").css("display", "none");
}

/**
 * Start the game.
 */
function restartGame(){
    $("#game-container").css("display", "block");
    $("#end-container").css("display", "none");
    $("canvas").remove();
    RogueJS.init();
}

function showSkills(){
    $("#game-container").css("display", "none");
    $("#skills-container").css("display", "block");
}
