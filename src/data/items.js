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
            common: [1, 3]
        }
    },
    TreasureGold = {
        char: '#',
        color: Colors.GOLD,
        name: 'Metal Chest',
        ability: ABILITY_WEAPON_DECENT,
        weighting: {
            rare: [2, 3],
            common: [4, 6],
        }
    },
    TreasureGold = {
        char: '#',
        color: Colors.BRIGHT_GOLD,
        name: 'Golden Chest',
        ability: ABILITY_WEAPON_EXCELLENT,
        weighting: {
            rare: [5, 6],
            common: [7, 9]
        }
    },
    // /* Shards */
    // Shard = {
    //     char: 'o',
    //     color: Colors.PURPLE,
    //     name: 'Strange Shard of Glass',
    //     ability: PASSIVE_GAIN_MINOR_HEAL,
    //     weighting: {
    //         rare: [1, 4]
    //     }
    // },
    // Shard = {
    //     char: 'o',
    //     color: Colors.PURPLE,
    //     name: 'Strange Shard of Glass',
    //     ability: FOV_BOOST,
    //     weighting: {
    //         common: [1, 4]
    //     }
    // },
    // Shard = {
    //     char: 'o',
    //     color: Colors.PURPLE,
    //     name: 'Strange Shard of Glass',
    //     ability: PASSIVE_GAIN_MINOR_POISON,
    //     weighting: {
    //         rare: [1, 4]
    //     }
    // },
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
            frequent: [1, 3]
        }
    },
    MajorFlask = {
        char: ':',
        color: '#4da500',
        name: 'Major Flask',
        ability: ABILITY_MAJOR_HEAL,
        weighting:{
            rare: [3, 3],
            frequent: [4, 7]
        }
    },
    DivineFlask = {
        char: ':',
        color: '#7301ba',
        name: 'Divine Flask',
        ability: ABILITY_DIVINE_HEAL,
        weighting:{
            rare: [4, 4],
            uncommon: [5, 7],
            common: [8, 10]
        }
    },
    LearnBook = {
        char: '[',
        color: '#cc0000',
        name: 'Leather Book',
        ability: ABILITY_LEARN_MINOR,
        weighting:{
            common: [2, 3],
            uncommon: [4, 5]
        }
    },
    LearnBookMajor = {
        char: '[',
        color: '#ba3c01',
        name: 'Dusty Tome',
        ability: ABILITY_LEARN_MAJOR,
        weighting:{
            uncommon: [3, 4],
            common: [5, 7]
        }
    },
    LearnBookDivine = {
        char: '[',
        color: '#910063',
        name: 'Demonic Tablet',
        ability: ABILITY_LEARN_DIVINE,
        weighting:{
            uncommon: [5, 6],
            common: [7, 10]
        }
    }
]

