/* DATA FILE: monsters.js
** author: singular1ty94
** STORES MONSTER INFORMATION
** PLEASE READ BEFORE EDITING!
** The monsters are grouped according to what
** level they should be placed on. So watch your
** syntax here.
** In each level, we use object literals. The name
** of the object isn't used ever. Follow the examples
** if you're lost.
*/
var monsters = [
    
    level_1 = [
        //Basic creature that deals minimal damage.
        Troll = {
            char: 't',
            color: '#f00',
            name: 'Troll',
            maxHP: 8,
            XP: 3,
            weapon: weapons.Club
        },
        
        //A powerful, but frail enemy.
        Goblin = {
            char: 'g',
            color: '#282',
            name: 'Goblin',
            maxHP: 6,
            XP: 4,
            weapon: weapons.Dagger
        }
    ]
]