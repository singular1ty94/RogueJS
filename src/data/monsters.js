/**
 * Draft Monster Generation Specification.
 * 
 * Starting with LEVEL, each Monster is requested and compared against the LEVEL.
 * Each Monster knows its rates per LEVEL group, ie: "common: [3, 5]" indicates that 
 *      for levels 3-5 (inclusive), the item has a COMMON
 *      chance of appearing.
 * 
 */
var monsters = [
    Goblin = {
        char: 'g',
        color: Colors.GOBLIN_GREEN,
        name: 'Goblin',
        maxHP: 6,
        XP: 4,
        range: 4,
        weapon: weapons.Dagger,
        weighting:{
            frequent: [1, 2],
            common: [3, 3]
        }
    },
    Goblin_Soldier = {
        char: 'G',
        color: Colors.GOBLIN_GREEN_DARK,
        name: 'Goblin Soldier',
        maxHP: 10,
        XP: 10,
        range: 5,
        weapon: weapons.Scimitar,
        weighting:{
            common: [2, 3],
            rare: [1, 1]
        }
    },
    Goblin_Scout = {
        char: 'g',
        color: Colors.GOBLIN_SCOUT,
        name: 'Goblin Scout',
        maxHP: 4,
        XP: 3,
        range: 7,
        weapon: weapons.Dagger,
        weighting:{
            frequent: [1, 3]
        }
    },
    Demon_Spawn = {
        char: 'd',
        color: '#d60000',
        name: 'Demon Spawn',
        maxHP: 15,
        XP: 25,
        range: 6,
        weapon: weapons.Claws,
        weighting:{
            frequent: [4, 7]
        }
    },
    Demon_Elite = {
        char: 'x',
        color: '#992121',
        name: 'Demon Xaigon',
        maxHP: 25,
        XP: 45,
        range: 7,
        weapon: weapons.Demonic_Blade,
        weighting:{
            uncommon: [4, 4],
            common: [5, 8]
        }
    }

]
