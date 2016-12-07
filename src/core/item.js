
var Item = function(x, y, name, char, color, AbilityCallback){
    this._x = x;
    this._y = y;
    this._char = char;
    this._color = color;
    this._name = name;
    this._AbilityCallback = AbilityCallback;
    this._isStairs = false;
    

    /**
    * Handles drawing back to the Display, only if the Actor is
    * in the Player's FOV.
    * @param bckColor the background color to use, defaults to COLOR_FOV_FLOOR
    */
    this._draw = function(bckColor){
        //Only draw if we're in the player's fov
        if(IsInFOV(this._x, this._y)){
            RogueJS.display.draw(this._x, this._y, this._char, this._color, COLOR_FOV_FLOOR);
        }else{
            if(RogueJS.discovered[this._x+","+this._y] == 0){
                RogueJS.display.draw(this._x, this._y, "", "#000", "#000");
            }else{
                var color = (RogueJSData[this._x+","+this._y] ? COLOR_DISCOVERED_WALL: COLOR_DISCOVERED_FLOOR);
                RogueJS.display.draw(this._x, this._y, "", "#fff", color);
            }
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
    this.useAbility = function(actor){ this._AbilityCallback(actor); }
    
    RogueJS.scheduler.add(this, true);

}
