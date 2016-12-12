
var Item = function(x, y, name, char, color, AbilityCallback){
    this._x = x;
    this._y = y;
    this._char = char;
    this._color = color;
    this._name = name;
    this._AbilityCallback = AbilityCallback;
   

    /**
    * Handles drawing back to the Display, only if the Actor is
    * in the Player's FOV.
    * @param bckColor the background color to use, defaults to Colors.FOV_FLOOR
    */
    this._draw = function(bckColor){
        //Only draw if we're in the player's fov
        if(IsInFOV(this._x, this._y) || RogueJS.player.seeItems){
            if(this._name == "Blood"){
                RogueJS.display.draw(this._x, this._y, this._char, this._color, this._color);
            }else{
                RogueJS.display.draw(this._x, this._y, this._char, this._color, Colors.FOV_FLOOR);
            }
            
        }else{
            if(RogueJS.discovered[this._x+","+this._y] == 0){
                RogueJS.display.draw(this._x, this._y, "", Colors.BLACK, Colors.BLACK);
            }else{
                var color = (RogueJSData[this._x+","+this._y] ? Colors.DISCOVERED_WALL: Colors.DISCOVERED_FLOOR);
                RogueJS.display.draw(this._x, this._y, "", Colors.WHITE, color);
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
    
    RogueJS.scheduler.add(this);

}
