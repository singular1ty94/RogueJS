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
    this._damage = 5;
    this._name = "Player";
    
    this.getName = function(){return this._name;}
    this.getX = function(){return this._x;}
    this.getY = function(){return this._y;}
    this.getDamage = function(){return this._damage;}
    this.getHP = function(){return this._HP;}
    this.getMaxHP = function(){return this._MaxHP;}
    
    RogueJS.scheduler.add(this, true);
    
    this.damageHP = function(amt){
        this._HP -= amt;
    }
    this.isDead = function(){
        return (this._HP <= 0 ? true: false);
    }
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
    keyMap[190] = 99;   //period, stay in spot
    keyMap[46] = 99;    //delete on numpad, stay in spot
    
    var code = e.keyCode;
    
    if(!(code in keyMap)) { return; }  //Return nothing if the key is invalid
    
    var newX, newY;
    
    if(keyMap[code] == 99){ //stay in spot
        newX = this._x;
        newY = this._y;
        
        //Clear the event listener and unlock the engine
        window.removeEventListener("keydown", this);
        RogueJS.engine.unlock();
        recalculateMap();
        return;
    }else{
        var diff = ROT.DIRS[8][keyMap[code]];
        newX = this._x + diff[0];
        newY = this._y + diff[1];
    }
    
    if (RogueJSData[newX+","+newY] == 1){ 
        return; //Cannot move there
    } else if (IsOccupied(newX, newY)){
        attackTile(this, newX, newY);
        //Clear the event listener and unlock the engine
        window.removeEventListener("keydown", this);
        RogueJS.engine.unlock();
        recalculateMap();
    }else {
        //Regular move
        RogueJS.display.draw(this._x, this._y, RogueJS.map[this._x + "," + this._y]);
        this._x = newX;
        this._y = newY;
        this._draw();

        //Clear the event listener and unlock the engine
        window.removeEventListener("keydown", this);
        RogueJS.engine.unlock();
        recalculateMap();
    }
}