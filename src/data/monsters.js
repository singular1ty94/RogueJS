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
        weapon: weapons.Dagger,
        weighting:{
            frequent: [1, 3],
            common: [4, 5]
        }
    },
    Goblin_Soldier = {
        char: 'g',
        color: Colors.GOBLIN_GREEN_DARK,
        name: 'Goblin Soldier',
        maxHP: 10,
        XP: 10,
        weapon: weapons.Scimitar,
        weighting:{
            common: [2, 4],
            uncommon: [5, 7]
        }
    },
    Goblin_Scout = {
        char: 'g',
        color: Colors.GOBLIN_SCOUT,
        name: 'Goblin Scout',
        maxHP: 4,
        XP: 3,
        weapon: weapons.Dagger,
        weighting:{
            frequent: [1, 3],
            common: [4, 5]
        }
    }

]
