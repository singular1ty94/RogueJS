/* file: weapon.js
** author: singular1ty94
** Stores information about weapons, such as whether they're
** melee 
*/
var Weapon = function(name, char, color, dmg, price){
    this._name = name;
    this._char = char;
    this._color = color;
    this._dmg = dmg;
    this._price = price;
    
    this.getName = function(){return this._name;}
    this.getChar = function(){return this._char;}
    this.getDamage = function(){return this._dmg;}
    this.getPrice = function(){return this._price;}
    
}