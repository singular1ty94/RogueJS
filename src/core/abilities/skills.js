var PASSIVE_ARCANA_RANK_ONE = {
    name: 'PASSIVE_ARCANA_RANK_ONE',
    prereq: null
 }
var PASSIVE_ARCANA_RANK_TWO = {
    name: 'PASSIVE_ARCANA_RANK_TWO',
    prereq: PASSIVE_ARCANA_RANK_ONE
 }
var PASSIVE_ARCANA_RANK_THREE = {
    name: 'PASSIVE_ARCANA_RANK_THREE',
    prereq: PASSIVE_ARCANA_RANK_TWO
 }

var PASSIVE_PERCEPTION_RANK_ONE = {
    name: 'PASSIVE_PERCEPTION_RANK_ONE',
    prereq: null,
    runOnce: false,
    fire: function(obj){
        if(!this.runOnce){
            this.runOnce = true;
            RogueJS.FOV_RADIUS += 2;
        }
    }
 }
var PASSIVE_PERCEPTION_RANK_TWO = {
    name: 'PASSIVE_PERCEPTION_RANK_TWO',
    prereq: PASSIVE_PERCEPTION_RANK_ONE
 }
var PASSIVE_PERCEPTION_RANK_THREE = { 
    name: 'PASSIVE_PERCEPTION_RANK_THREE',
    prereq: PASSIVE_PERCEPTION_RANK_TWO
}

var PASSIVE_WEAPONS_RANK_ONE = { 
    name: 'PASSIVE_WEAPONS_RANK_ONE',
    prereq: null,
    runOnce: false,
    fire: function(obj){
        if(!this.runOnce){
            this.runOnce = true;
            RogueJS.player._weapon._dmg = RogueJS.player._weapon.getDamage() + Math.round(RogueJS.player._weapon.getDamage() / 3) 
        }
    }
}
var PASSIVE_WEAPONS_RANK_TWO = { 
    name: 'PASSIVE_WEAPONS_RANK_TWO',
    prereq: PASSIVE_WEAPONS_RANK_TWO
}
var PASSIVE_WEAPONS_RANK_THREE = { 
    name: 'PASSIVE_WEAPONS_RANK_THREE',
    prereq: PASSIVE_WEAPONS_RANK_THREE
}

var SKILLS = [PASSIVE_ARCANA_RANK_ONE, PASSIVE_ARCANA_RANK_TWO, PASSIVE_ARCANA_RANK_THREE,
PASSIVE_PERCEPTION_RANK_ONE, PASSIVE_PERCEPTION_RANK_TWO, PASSIVE_PERCEPTION_RANK_THREE, PASSIVE_WEAPONS_RANK_ONE,
PASSIVE_WEAPONS_RANK_TWO, PASSIVE_WEAPONS_RANK_THREE];

/**
 * Helper method to find a skill using just its name.
 */
SKILLS.find = function (skill){
    var skillFind = null;
    SKILLS.forEach(function (s){
        if(skill == s.name){
            skillFind = s;
        }
    })
    return skillFind ? skillFind : -1;
}