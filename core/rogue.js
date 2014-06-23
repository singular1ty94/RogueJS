//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94

var w = 89;
var h = 27;
var display = null;
var map = null;
var player = null;
var engine = null;

var RogueJS = {
    /**
    * Our constructor, for all intents and purposes.
    */
    init: function () {
        display = new ROT.Display({width: w, height: h});
        
        //Generate the map and make the player.
        map = new ROT.Map.Rogue(w, h);
        map.create(display.DEBUG);
        this.createPlayer();        
        document.getElementById("RogueCanvas").appendChild(display.getContainer());
        
        //Setup the scehduler and engine
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(player, true);
        engine = new ROT.Engine(scheduler);
        engine.start();
    },
    
    //Drop the player in the top-left room.
    createPlayer: function(){
        var room = map.rooms;
        var x = room[0][0].x + 1;
        var y = room[0][0].y + 1;
        player = new Player(x, y);
    }    
    
}

//Defining a player
var Player = function(x, y){
    this._x = x;
    this._y = y;
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
    
    if (map.map[newX][newY] == 1){ return;} //Cannot move there
    
    display.draw(this._x, this._y, map[this._x + "," + this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    //Clear the event listener and unlock the engine
    window.removeEventListener("keydown", this);
    engine.unlock();

}