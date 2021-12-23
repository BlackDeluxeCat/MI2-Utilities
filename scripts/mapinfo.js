module.exports={
    show:function(){
        Log.info("MI2U_MapInfo");

        var mapInfoD = extend(BaseDialog, "MI2U-MapInfo", {
            setup(){
                var state = Vars.state;
                var control = Vars.control;
                var iconMed = Vars.iconMed;
                var content = Vars.content;

                this.cont.clear();
                this.buttons.clear();
    
                let twave = new Table();
                this.cont.add(twave);
                
                /* Stats */
                twave.table(cons(t => {
                    t.label(() => (control.saves.getCurrent() != null ? ("Time: " + control.saves.getCurrent().getPlayTime() + "\n"):"") + 
                    "Kill: " + state.stats.enemyUnitsDestroyed).pad(5);
                    t.label(() => "Build: " + state.stats.buildingsBuilt + 
                    "\nDescons: " + state.stats.buildingsDeconstructed + 
                    "\nDestroy: " + state.stats.buildingsDestroyed).pad(5);
                })).left();
                twave.row();
    
                twave.label(() => "Wave " + (state.wave));
                twave.row();
    
                twave.table(cons(t => {
                    t.update(() => {
                        if(!this.isShown()) return;
                        t.clear();
                        var curInfoWave = state.wave;
    
                        for(let sgi = 0; sgi < state.rules.spawns.size; sgi++){
                            let group = state.rules.spawns.get(sgi);
                            if(group.getSpawned(curInfoWave) > 0){
                                t.image(group.type.uiIcon).size(iconMed).scaling(Scaling.fit);
                            }
                        }
                        
                        t.row();

                        for(let sgi = 0; sgi < state.rules.spawns.size; sgi++){
                            let group = state.rules.spawns.get(sgi);
                            if(group.getSpawned(curInfoWave) > 0){
                                let l = t.label(() => "" + group.getSpawned(curInfoWave) + "\n" + group.getShield(curInfoWave))
                                .padLeft(2).padRight(2).get();
                                l.setAlignment(Align.center);
                                l.setFontScale(0.9);
                            }
                        }
    
                        t.row();

                        for(let sgi = 0; sgi < state.rules.spawns.size; sgi++){
                            let group = state.rules.spawns.get(sgi);
                            if(group.getSpawned(curInfoWave) > 0){
                                if(group.effect != null && group.effect != content.getByName(ContentType.status, "none")){
                                    //t.image(() => group.effect.uiIcon).size(iconMed).scaling(Scaling.fit);
                                    t.label(() => group.effect.name);
                                }else{
                                    t.labelWrap("-");
                                }
                            }
                        }

                        t.row();
                        for(let sgi = 0; sgi < state.rules.spawns.size; sgi++){
                            let group = state.rules.spawns.get(sgi);
                            if(group.getSpawned(curInfoWave) > 0){
                                if(group.items != null){
                                    t.image(group.items.item.uiIcon).size(iconMed).scaling(Scaling.fit);
                                }else{
                                    t.labelWrap("-");
                                }
                            }
                        }
                        t.row();
                        for(let sgi = 0; sgi < state.rules.spawns.size; sgi++){
                            let group = state.rules.spawns.get(sgi);
                            if(group.getSpawned(curInfoWave) > 0){
                                if(group.items != null){
                                    let l = t.label(() => "" + group.items.amount)
                                    .padLeft(2).padRight(2).get();
                                    l.setAlignment(Align.center);
                                    l.setFontScale(0.9);
                                }else{
                                    t.labelWrap("-");
                                }
                            }
                        }
                    });
                }));
    
                this.cont.row();
    
                let tmap = new Table();
                let teamPane = new ScrollPane(tmap);
                this.cont.add(teamPane);
                let teams = state.teams.getActive();
                tmap.add("Team").padLeft(5).padRight(5);
                tmap.add("UBuild Spd").padLeft(5).padRight(5);
                tmap.add("Unit Dmg").padLeft(5).padRight(5);
                tmap.add("Block Hp").padLeft(5).padRight(5);
                tmap.add("Block Dmg").padLeft(5).padRight(5);
                tmap.add("Build Spd").padLeft(5).padRight(5);
                tmap.add("Inf Ammo").padLeft(5).padRight(5);
                tmap.add("Inf Res").padLeft(5).padRight(5);
                tmap.add("Cheat").padLeft(5).padRight(5);
                tmap.add("AI-Tier-CoreSpawn").padLeft(5).padRight(5);
                for(let ti = 0; ti < state.teams.getActive().size; ti++){
                    let teamData = state.teams.getActive().get(ti);
                    tmap.row();
                    let teamRule = state.rules.teams.get(teamData.team);
                    tmap.add("[#" + teamData.team.color + "]" + teamData.team.localized());
                    tmap.add("" + teamRule.unitBuildSpeedMultiplier).color(teamData.team.color);
                    tmap.add("" + teamRule.unitDamageMultiplier).color(teamData.team.color);
                    tmap.add("" + teamRule.blockHealthMultiplier).color(teamData.team.color);
                    tmap.add("" + teamRule.blockDamageMultiplier).color(teamData.team.color);
                    tmap.add("" + teamRule.buildSpeedMultiplier).color(teamData.team.color);
                    tmap.add("" + teamRule.infiniteAmmo).color(teamData.team.color);
                    tmap.add("" + teamRule.infiniteResources).color(teamData.team.color);
                    tmap.add("" + teamRule.cheat).color(teamData.team.color);
                    tmap.add("" + (teamRule.ai ? "AI: T" + teamRule.aiTier + (teamRule.aiCoreSpawn ? ", Core Spawn" : "") : "No")).color(teamData.team.color);
                }
            }
    
        });
        mapInfoD.addCloseButton();
        mapInfoD.setup();
        mapInfoD.show();
    }
}