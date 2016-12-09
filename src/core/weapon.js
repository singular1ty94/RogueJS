/* file: weapon.js
** author: singular1ty94
** Stores information about weapons, such as whether they're
** melee 
*/
var Weapon = function(name, char, color, dmg, price, x, y){
    this._x = x;
    this._y = y;
    this._char = char;
    this._color = color;
    this._name = name;
    this._dmg = dmg;
    this._price = price;
    

    /**
    * Handles drawing back to the Display, only if the Actor is
    * in the Player's FOV.
    * @param bckColor the background color to use, defaults to Colors.FOV_FLOOR
    */
    this._draw = function(bckColor){
        var bckColor = bckColor || Colors.FOV_FLOOR; //Set default value

        //Only draw if we're in the player's fov
        if(IsInFOV(this._x, this._y)){
            RogueJS.display.draw(this._x, this._y, this._char, this._color, bckColor);
        }else{
            RogueJS.display.draw(this._x, this._y, RogueJS.map[this._x + "," + this._y]);
        }
    }

    this.act = function(){
        //Do nothing.
    }

    this.getX = function(){return this._x;}
    this.getY = function(){return this._y;}
    this.getName = function(){return this._name;}
    this.getChar = function(){return this._char;}
    this.getDamage = function(){return this._dmg;}
    this.getPrice = function(){return this._price;}
    
    RogueJS.scheduler.add(this);

}
