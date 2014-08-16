/* file: actor.js
** author: singular1ty94
** Stores information about actors, how to draw them,
** and their movement properties.
*/
var Actor = function(x, y, char, color, name, maxHP, weapon){
    this._x = x;
    this._y = y;
    this._char = char;
    this._color = color;
    this._name = name;
    this._maxHP = maxHP;
    this._HP = this._maxHP;     //Init with full health.
    this._weapon = new Weapon(weapon.name, weapon.char, weapon.color, weapon.dmg, weapon.price);
    
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
            if (path.length <= 1) {
                //The player occupies the path, we attack!
                attackTile(this, RogueJS.player.getX(), RogueJS.player.getY());
            } else if(IsOccupied(path[0][0], path[0][1])){
                //Another entity (NOT the player) occupies the spot
            }else {
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
    this.getName = function(){return this._name;}
    this.getDamage = function(){
        //Returns the damage from the equipped weapon.
        return this._weapon.getDamage();
    }
    this.damageHP = function(amt){
        this._HP -= amt;
    }
    this.isDead = function(){
        return (this._HP <= 0 ? true: false);
    }
    
    RogueJS.scheduler.add(this, true); 
}