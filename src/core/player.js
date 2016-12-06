/* file: player.js
** author: singular1ty94
** Stores information about player, how to draw it,
** and its movement properties and actions.
*/
//Defining a player
var Player = function(x, y){
    this._x = x;
    this._y = y;
    this._MaxHP = 40;
    this._HP = this._MaxHP;
    this._level = 1;
    this._XP = 0;
    this._NextXP = 20;
    this._draw();
    this._name = "Player";
    this._weapon = new Weapon(weapons.playerWeapon.name, 
                             weapons.playerWeapon.char,
                             weapons.playerWeapon.color,
                             weapons.playerWeapon.dmg,
                             weapons.playerWeapon.price);
    
    this.getName = function(){return this._name;}
    this.getX = function(){return this._x;}
    this.getY = function(){return this._y;}
    this.getDamage = function(){
        //Returns the damage from the weapon.
        return this._weapon.getDamage();
    }
    this.getHP = function(){return this._HP;}
    this.getMaxHP = function(){return this._MaxHP;}

    this.getXP = function(){return this._XP;}
    this.getNextXP = function(){return this._NextXP;}
    
    RogueJS.scheduler.add(this, true);

    this.levelUp = function(leftover){
        //Increment levelUp
        this._level += 1;
        this._XP = leftover;
        this._NextXP = Math.round(Math.pow(this._level, 1.3) * 20);
        //Boost HP
        this._MaxHP += Math.round(Math.pow(this._level, 1.3) * 10);
    }

    this.gainXP = function(xp){
        this._XP += xp;
        if(this._XP >= this._NextXP){
            this.levelUp(this._XP - this._NextXP);
        }
    }
    
    this.damageHP = function(amt){
        this._HP -= amt;
    }
    this.isDead = function(){
        return (this._HP <= 0 ? true: false);
    }
    
    /**
    * Takes an instantiated Weapon and replaces the
    * current weapon.
    */
    this.changeWeapon = function(newWeapon){
        this._weapon = newWeapon;
    }
}

//The player's drawing function
Player.prototype._draw = function(){
    RogueJS.display.draw(this._x, this._y, "@", "#fff");
}

//The function that the engine will be calling by default
Player.prototype.act = function(){
    //Identify if we're dead
    if(this._HP <= 0){
        RogueJS.postmortem();
    }else{
        //Lockup the engine to await user input
        RogueJS.engine.lock();
        //Await user input on the player object - must have handleEvent function.
        window.addEventListener("keydown", this); 
    }
}

//Handle user input
Player.prototype.handleEvent = function(e){
    if(this._HP <= 0) { return; }  

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
        recalculateMap();
        RogueJS.engine.unlock();
    }else {
        //Regular move
        RogueJS.display.draw(this._x, this._y, RogueJS.map[this._x + "," + this._y]);
        this._x = newX;
        this._y = newY;
        this._draw();

        //Clear the event listener and unlock the engine
        window.removeEventListener("keydown", this);
        recalculateMap();
        RogueJS.engine.unlock();
    }
}