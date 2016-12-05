
var Item = function(name, char, color, price, x, y, AbilityCallback){
    this._x = x;
    this._y = y;
    this._char = char;
    this._color = color;
    this._name = name;
    this._price = price;
    this._AbilityCallback = AbilityCallback;
    

    /**
    * Handles drawing back to the Display, only if the Actor is
    * in the Player's FOV.
    * @param bckColor the background color to use, defaults to COLOR_FOV_FLOOR
    */
    this._draw = function(bckColor){
        var bckColor = bckColor || COLOR_FOV_FLOOR; //Set default value

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
    this.getPrice = function(){return this._price;}
    this.useAbility = function(params){ this._AbilityCallback(params); }
    
    RogueJS.scheduler.add(this, true);

}
