/**
 * POSITIVE: Minor Heal
 */
function PASSIVE_MINOR_HEAL(player){
    player._HP += 1;
    if(player._HP >= player._MaxHP){
        player._HP = player._MaxHP;
    }
}

function PASSIVE_GAIN_MINOR_HEAL(player){
    RogueJS.player.addPassive(PASSIVE_MINOR_HEAL);
    MessageLog("The %c{"+Colors.PURPLE+"}shard%c{} cuts your hand. Ancient %c{"+Colors.PURPLE+"}magic%c{} rushes through your veins!");
    MessageLog("You now %c{"+Colors.HEALTH_LIGHT+"}regenerate health%c{}.");
}

/**
 * NEGATIVE: Minor Poison
 */
function PASSIVE_MINOR_POISON(player){
    player._HP -= 1;
    if(player._HP <= 0){
        RogueJS.postmortem();
    }
}

function PASSIVE_GAIN_MINOR_POISON(player){
    RogueJS.player.addPassive(PASSIVE_MINOR_POISON);
    MessageLog("The %c{"+Colors.PURPLE+"}shard%c{} cuts your hand. Ancient %c{"+Colors.PURPLE+"}magic%c{} rushes through your veins!");
    MessageLog("You are %c{"+Colors.BLOOD+"}poisoned%c{}!");
}