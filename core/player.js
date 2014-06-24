/* file: player.js
** author: singular1ty94
** Stores information about player, how to draw it,
** and its movement properties and actions.
*/
//Defining a player
var Player = function(x, y){
    this._x = x;
    this._y = y;
    this._MaxHP = 100;
    this._HP = this._MaxHP;
    this._draw();
    
    this.getX = function(){return this._x;}
    this.getY = function(){return this._y;}
    
    RogueJS.scheduler.add(this, true);
}

//The player's drawing function
Player.prototype._draw = function(){
    RogueJS.display.draw(this._x, this._y, "@", "#fff");
}

//The function that the engine will be calling by default
Player.prototype.act = function(){
    //Lockup the engine to await user input
    RogueJS.engine.lock();
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
    
    if (RogueJSData[newX+","+newY] == 1){ 
        return; 
    } else if (IsOccupied(newX, newY)){
        return;
    } //Cannot move there
    
    RogueJS.display.draw(this._x, this._y, RogueJS.map[this._x + "," + this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    //Clear the event listener and unlock the engine
    window.removeEventListener("keydown", this);
    RogueJS.engine.unlock();
    recalculateMap();
}