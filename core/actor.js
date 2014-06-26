/* file: actor.js
** author: singular1ty94
** Stores information about actors, how to draw them,
** and their movement properties.
*/
var Actor = function(x, y, char, color, maxHP, dmg){
    this._x = x;
    this._y = y;
    this._char = char;
    this._color = color;
    this._maxHP = maxHP;
    this._hp = this._maxHP;     //Init with full health.
    this._dmg = dmg;
    
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
        if(IsInFOV(this._x, this._y)){
            var x = RogueJS.player.getX();
            var y = RogueJS.player.getY();
            var passableCallback = function(x, y) {
                return (RogueJSData[x+","+y] === 0);
            }
            var astar = new ROT.Path.Dijkstra(x, y, passableCallback);

            var path = [];
            var pathCallback = function(x, y) {
                path.push([x, y]);
            }
            astar.compute(this._x, this._y, pathCallback);
            path.shift(); //Remove previous position
            if (path.length <= 2) {
                //One space away from player
            } else {
                x = path[0][0];
                y = path[0][1];
                RogueJS.display.draw(this._x, this._y, RogueJS.map[this._x + "," + this._y]);
                this._x = x;
                this._y = y;
                this._draw();
            }
        }
    }
    
    this.getX = function(){return this._x;}
    this.getY = function(){return this._y;}
    
    RogueJS.scheduler.add(this, true); 
}