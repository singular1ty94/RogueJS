//ROGUE.JS A JAVASCRIPT ROGUELIKE BY SINGULAR1TY94

var w = 89;
var h = 27;
var display = null;
var map = null;
var player = null;

var RogueJS = {
    /**
    * Our constructor, for all intents and purposes.
    */
    init: function () {
        display = new ROT.Display({width: w, height: h});
        map = new ROT.Map.Rogue(w, h);
        map.create(display.DEBUG);
        this.createPlayer();
        document.getElementById("RogueCanvas").appendChild(display.getContainer());
    },
    
    //Drop the player in the top-left room.
    createPlayer: function(){
        var room = map.rooms;
        var x = room[0][0].x + 1;
        var y = room[0][0].y + 1;
        player = new Player(x, y);
    }
    
};

//Defining a player
var Player = function(x, y){
    this._x = x;
    this._y = y;
    this._draw();
};

Player.prototype._draw = function(){
    display.draw(this._x, this._y, "@", "#f00");
};