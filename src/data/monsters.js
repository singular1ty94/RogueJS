/**
 * Draft Monster Generation Specification.
 * 
 * Starting with LEVEL, each Monster is requested and compared against the LEVEL.
 * Each Monster knows its rates per LEVEL group, ie: "common: [3, 5]" indicates that 
 *      for levels 3-5 (inclusive), the item has a COMMON
 *      chance of appearing.
 *
 * Draft Design:
 * --- Goblin Outpost ---
 * Level 1: Bloodflies++, Goblins+, Goblin Soldiers-
 * Level 2: Bloodflies++, Goblins+, Goblin Soldiers+, Rare-
 * Level 3: Goblins+, Goblin Soldiers+, Troll
 * 
 */
var monsters = [
    WatcherOfTheAbyss = {
        char: 'W',
        color: '#00748e',
        name: 'Watcher of the Abyss',
        maxHP: 35,
        XP: 115,
        range: 99,
        weapon: {
            name: 'Abyss Tentacle',
            color: '#6210ff',
            char: '/',
            dmg: 20,
            price: 90
        },
        weighting:{
            uncommon: [8, 9]
        }
    },
    Goblin = {
        char: 'g',
        color: Colors.GOBLIN_GREEN,
        name: 'Goblin',
        maxHP: 6,
        XP: 7,
        range: 4,
        weapon: weapons.Dagger,
        weighting:{
            common: [1, 3]
        }
    },
    Goblin_Soldier = {
        char: 'G',
        color: Colors.GOBLIN_GREEN_DARK,
        name: 'Goblin Soldier',
        maxHP: 10,
        XP: 15,
        range: 5,
        weapon: {
            name: 'Scimitar',
            color: '#6210ff',
            char: '/',
            dmg: 5,
            price: 90
        },
        weighting:{
            common: [2, 3],
            rare: [1, 1]
        }
    },
    CaptiveTroll = {
        char: 'T',
        color: '#4d9e8d',
        name: 'Captive Troll',
        maxHP: 35,
        XP: 32,
        range: 4,
        weapon: {
            name: 'Fists', color: '#777', char: '/',
            dmg: 12,
            price: 60
        },
        weighting:{
            uncommon: [3,3],
            rare: [2, 2]
        }
    },
    BloodFly = {
        char: '\u00F5',
        color: '#c12600',
        name: 'Bloodfly',
        maxHP: 4,
        XP: 3,
        range: 16,
        weapon: {
            name: 'Fly Bite', color: '#777', char: '/',
            dmg: 2,
            price: 60
        },
        weighting:{
            frequent: [1, 2]
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
