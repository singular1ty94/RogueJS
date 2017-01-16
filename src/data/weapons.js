/* DATA FILE: weapons.js
** author: singular1ty94
** STORES WEAPON INFORMATION
** PLEASE READ
** Weapons are stored in OBJECT LITERAL
** form, this is so we can call
** weapons.Club or similar.
** Each Actor or Item is responsible for
** instantiating it's own unique version of
** a weapon. It's inefficent but might payoff 
** later on.
*/
var weapons = {
    //The special first weapon the player uses.
    playerWeapon : {
        name: 'Broken Sword',
        color: '#777',
        char: '/',
        dmg: 3,
        price: 34
    }
}
