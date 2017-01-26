/**
 * Grants a random basic weapon.
 */
function ABILITY_WEAPON_BASIC(player){
    // Basic weapon criteria.
    var adjective = ['Wooden', 'Chipped', 'Rusted', 'Bent', 'Damaged', 'Broken', 'Makeshift'];
    var weapon = ['Sword', 'Club', 'Spear', 'Mace', 'Axe', 'Dagger', 'Knife'];
    var color = "#d77";
    var char = "/";
    
    var dmg = getRandom(4, 9);
    if(RogueJS.player.hasPassive(PASSIVE_WEAPONS_RANK_ONE)){ dmg += Math.round(dmg/3); }
    var price = getRandom(25, 60);
    var name = adjective[getRandom(0, adjective.length)] + " " + weapon[getRandom(0, weapon.length)];

    MessageLog("You wield the %c{"+Colors.BRONZE+"}" + name + "%c{}!");
    var weapon = new Weapon(name, char, color, dmg, price, null, null);
    player.changeWeapon(weapon);
}

/**
 * Grants a random decent weapon.
 */
function ABILITY_WEAPON_DECENT(player){
    // Decent weapon criteria.
    var adjective = ['Solid', 'Reliable', 'Decent', 'Adequate', 'Common', 'Standard'];
    var weapon = ['Sword', 'Katana', 'Spear', 'Mace', 'Battle-Axe', 'Dagger'];
    var color = "#d77";
    var char = "/";
    
    var dmg = getRandom(12, 24);
    if(RogueJS.player.hasPassive(PASSIVE_WEAPONS_RANK_ONE)){ dmg += Math.round(dmg/3); }
    var price = getRandom(80, 150);
    var name = adjective[getRandom(0, adjective.length)] + " " + weapon[getRandom(0, weapon.length)];

    MessageLog("You wield the %c{"+Colors.GOLD+"}" + name + "%c{}!");
    var weapon = new Weapon(name, char, color, dmg, price, null, null);
    player.changeWeapon(weapon);
}

/**
 * Grants a random excellent weapon.
 */
function ABILITY_WEAPON_EXCELLENT(player){
    // Excellent weapon criteria.
    var adjective = ['Stunning', 'Honed', 'Superb', 'Shattering', 'Gods-Borne'];
    var weapon = ['Sword', 'Katana', 'Spear', 'Mace', 'Battle-Axe', 'Flail'];
    var color = "#d77";
    var char = "/";
    
    var dmg = getRandom(35, 45);
    if(RogueJS.player.hasPassive(PASSIVE_WEAPONS_RANK_ONE)){ dmg += Math.round(dmg/3); }
    var price = getRandom(80, 150);
    var name = adjective[getRandom(0, adjective.length)] + " " + weapon[getRandom(0, weapon.length)];

    MessageLog("You wield the %c{"+Colors.GOLD+"}" + name + "%c{}!");
    var weapon = new Weapon(name, char, color, dmg, price, null, null);
    player.changeWeapon(weapon);
}