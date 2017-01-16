/**
 * Takes a player and gains XP.
 */
function FOV_BOOST(player){
    RogueJS.FOV_RADIUS = 8;
    RogueJS.lighting.setOptions({ range: 8 });
    MessageLog("Your torch flares to life!");
}