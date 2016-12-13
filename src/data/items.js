/**
 * Draft Item Generation Specification.
 * 
 * Starting with LEVEL, each ITEM is requested and compared against the LEVEL.
 * Each ITEM knows its rates per LEVEL group, ie: "common: [3, 5]" indicates that 
 *      for levels 3-5 (inclusive), the item has a COMMON
 *      chance of appearing.
 * 
 */
var items = [
    /* Treasure */
    Treasure = {
        char: '#',
        color: Colors.ORANGE_GOLD,
        name: 'Plain Chest',
        ability: ABILITY_WEAPON_BASIC,
        weighting: {
            common: [1, 4],
            uncommon: [5, 8]
        }
    },
    TreasureGold = {
        char: '#',
        color: Colors.GOLD,
        name: 'Metal Chest',
        ability: ABILITY_WEAPON_DECENT,
        weighting: {
            rare: [5, 8],
            uncommon: [9, 11]
        }
    },
    /* Shards */
    Shard = {
        char: 'o',
        color: Colors.PURPLE,
        name: 'Strange Shard of Glass',
        ability: PASSIVE_GAIN_MINOR_HEAL,
        weighting: {
            uncommon: [1, 4]
        }
    },
    Shard = {
        char: 'o',
        color: Colors.PURPLE,
        name: 'Strange Shard of Glass',
        ability: PASSIVE_GAIN_MINOR_POISON,
        weighting: {
            uncommon: [1, 4]
        }
    },
    Bones = {
        char: '%',
        color: Colors.WHITE,
        name: 'Skeleton',
        ability: ABILITY_NOTHING,
        weighting: {
            common: [1, 99]
        }
    },
    MinorFlask = {
        char: ':',
        color: '#33cc33',
        name: 'Minor Flask',
        ability: ABILITY_HEAL,
        weighting:{
            frequent: [3, 5],
            common: [1, 2]
        }
    },

    LearnBook = {
        char: '[',
        color: '#cc0000',
        name: 'Small Book',
        ability: ABILITY_LEARN_MINOR,
        weighting:{
            common: [6, 8],
            uncommon: [4, 5],
            rare: [2, 3]
        }
    }
]

