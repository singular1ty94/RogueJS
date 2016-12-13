/**
 * POSITIVE: Minor Heal
 */
var PASSIVE_MINOR_HEAL = {
    symbol: "%c{"+Colors.HEALTH_LIGHT+"}HP+%c{}",
    fire: function(player){
        if(getRandom(0, 100) <= 20){
            player._HP += 1;
        }
        if(player._HP >= player._MaxHP){
            player._HP = player._MaxHP;
        }
    }
}

function PASSIVE_GAIN_MINOR_HEAL(player){
    if(RogueJS.player.addPassive(PASSIVE_MINOR_HEAL)){
        MessageLog("The %c{"+Colors.PURPLE+"}shard%c{} cuts your hand. Ancient %c{"+Colors.PURPLE+"}magic%c{} rushes through your veins!");
        MessageLog("You now %c{"+Colors.HEALTH_LIGHT+"}regenerate health%c{}.");
    }else{
        MessageLog("You are already %c{"+Colors.HEALTH_LIGHTBLOOD+"}regenerating health%c{}.")
    }

}

/**
 * NEGATIVE: Minor Poison
 */
var PASSIVE_MINOR_POISON = {
    symbol: this.symbol = "%c{"+Colors.PURPLE+"}HP-%c{}",
    fire: function(player){
        /* 20% chance of poison damange */
        if(getRandom(0, 100) <= 20){
            player._HP -= 1;
        }
        if(player._HP <= 0){
            RogueJS.postmortem();
        }
    }
}

function PASSIVE_GAIN_MINOR_POISON(player){
    if(RogueJS.player.addPassive(PASSIVE_MINOR_POISON)){
        MessageLog("The %c{"+Colors.PURPLE+"}shard%c{} cuts your hand. Ancient %c{"+Colors.PURPLE+"}magic%c{} rushes through your veins!");
        MessageLog("You are %c{"+Colors.BLOOD+"}poisoned%c{}!");
    }else{
        MessageLog("You are already %c{"+Colors.BLOOD+"}poisoned%c{}.")
    }

}