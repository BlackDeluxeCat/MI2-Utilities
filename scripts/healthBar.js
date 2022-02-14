var content;
var state;
var teamData;
module.exports={
    drawAll:function(){
        state = Vars.state;
        content = Vars.content;
        for(let tid = 0; tid < state.teams.getActive().size; tid++){
            teamData = state.teams.getActive().get(tid);
            for(let uid = 0; uid < teamData.units.size; uid++){
                draw(teamData.units.get(uid));
            }
        }
    }
}

function draw(unit){
    //display healthbar by MI2
    if(Math.abs(unit.x - Core.camera.position.x) > (Core.camera.width / 2) || Math.abs(unit.y - Core.camera.position.y) > (Core.camera.height / 2)) return;
    Draw.z(Layer.shields + 6);
    Draw.reset();
    if(unit.hitTime > 0){
        Lines.stroke(4 + Mathf.lerp(0, 2, Mathf.clamp(unit.hitTime)));
        Draw.color(Color.white, Mathf.lerp(0.1, 1, Mathf.clamp(unit.hitTime)));
        Lines.line(unit.x - unit.hitSize * 0.6, unit.y + (unit.hitSize / 2), unit.x + unit.hitSize * 0.6, unit.y + (unit.hitSize / 2));
    }
    Lines.stroke(4);
    Draw.color(unit.team.color, 0.5);
    Lines.line(unit.x - unit.hitSize * 0.6, unit.y + (unit.hitSize / 2), unit.x + unit.hitSize * 0.6, unit.y + (unit.hitSize / 2));
    Draw.color((unit.health > 0 ? Pal.health:Color.gray), 0.8);
    Lines.stroke(2);
    Lines.line(
        unit.x - unit.hitSize * 0.6, unit.y + (unit.hitSize / 2), 
        unit.x + unit.hitSize * ((unit.health > 0 ? unit.health : Mathf.maxZero(unit.maxHealth + unit.health)) / unit.maxHealth * 1.2 - 0.6), unit.y + (unit.hitSize / 2));
    Lines.stroke(2);
    if(unit.shield > 0){
        for(let didgt = 1; didgt <= Mathf.digits(unit.shield / unit.maxHealth) + 1; didgt++){
            //if(didgt == Mathf.digits((int)(unit.shield / unit.maxHealth)) + 1) continue;
            Draw.color(Pal.shield, 0.8);
            let barLength = Mathf.mod(unit.shield / unit.maxHealth, Mathf.pow(10, didgt - 1)) / Mathf.pow(10, didgt - 1);
            if(didgt > 1){
                //let x = unit.x - (1 - Mathf.floor(barLength * 10) / 10) / 2 * 1.2 * unit.hitSize;
                let y = unit.y + unit.hitSize / 2 + didgt * 2;
                //let w = 1.2 * Mathf.floor(barLength * 10) / 10 * unit.hitSize;
                for(let i = 1; i <= Mathf.floor(barLength * 10); i++){
                    Fill.rect(unit.x - 0.55 * unit.hitSize + (i - 1) * 0.12 * unit.hitSize, y, 0.1 * unit.hitSize, 2);
                }
            }else{
                let x = unit.x - (1 - barLength) / 2 * 1.2 * unit.hitSize;
                let y = unit.y + unit.hitSize / 2 + didgt * 2;
                let w = 1.2 * barLength * unit.hitSize;
                Fill.rect(x, y, w, 2);
            }
        }
    }
    
    var index = 0;
    for(let effi = 0; effi < content.statusEffects().size; effi++){
        let eff = content.statusEffects().get(effi);
        if(unit.hasEffect(eff)){
            let iconSize = Mathf.ceil(unit.hitSize / 4);
            Draw.rect(eff.uiIcon, 
            unit.x - unit.hitSize * 0.6 + 0.5 * iconSize * Mathf.mod(index, 4), 
            unit.y + (unit.hitSize / 2) + 3 + iconSize * Mathf.floor(index / 4), 
            4, 4);
            index++;
        }
    }
}