
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
        if(IsInFOV(this._x, this._y) || (RogueJS.player && RogueJS.player.hasPassive(PASSIVE_PERCEPTION_RANK_TWO))){
            if(this._name == "Blood" || this._name == "Bloody Corpse"){
                var color = (this._name == "Blood" ? RogueJSLight[this._x+","+this._y]: Colors.WHITE);
                RogueJS.display.draw(this._x, this._y, this._char, color, this._color);
            }else{
                RogueJS.display.draw(this._x, this._y, this._char, this._color, RogueJSLight[this._x+","+this._y]);
            }
            
        }else{
            if(RogueJS.discovered[this._x+","+this._y] == 0){
                RogueJS.display.draw(this._x, this._y, "", RogueJSLight[this._x+","+this._y], RogueJSLight[this._x+","+this._y]);
            }else{

                RogueJS.display.draw(this._x, this._y, "", RogueJSLight[this._x+","+this._y], RogueJSLight[this._x+","+this._y]);
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
