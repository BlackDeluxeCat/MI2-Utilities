module.exports={
    show:function(){
        Log.info("MI2U_MapInfo");

        var mapInfoD = extend(BaseDialog, "@mapInfo.MI2U", {
            setup(){
                var state = Vars.state;
                var control = Vars.control;
                var iconMed = Vars.iconMed;
                var content = Vars.content;
                var world = Vars.world;

                let colorEnable = new Color(1,1,1);
                let colorDisable = new Color(1,0.3,0.3,0.8);

                this.cont.clear();
                this.buttons.clear();
    
                let trule = new Table();
                this.cont.add(trule);
                this.cont.row();

                let twave = new Table();
                this.cont.add(twave);
                this.cont.row();

                let tmap = new Table();
                let teamPane = new ScrollPane(tmap);
                this.cont.add(teamPane);

                this.addCloseButton();

                /* rules */
                trule.table(cons(t => {
                    
                    t.label(() => "" + String.fromCharCode(Iconc.statusBurning)).get().setColor((state.rules.fire?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.itemBlastCompound)).get().setColor((state.rules.damageExplosions?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.blockThoriumReactor)).get().setColor((state.rules.reactorExplosions?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.itemCopper)).get().setColor((state.rules.unitAmmo?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.blockMicroProcessor)).get().setColor((state.rules.logicUnitBuild?colorEnable:colorDisable));
                    t.row();
        
                    t.label(() => "" + String.fromCharCode(Iconc.blockIlluminator)).get().setColor((state.rules.lighting?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.blockIncinerator)).get().setColor((state.rules.coreIncinerates?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.paste)).get().setColor((state.rules.schematicsAllowed?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.blockCoreNucleus)).get().setColor((state.rules.coreCapture?colorEnable:colorDisable));
                    t.label(() => "" + String.fromCharCode(Iconc.grid)).get().setColor((state.rules.polygonCoreProtection?colorEnable:colorDisable));
                    t.row();

                    t.label(() => world != null ? (world.width() + "x" + world.height()):"ohno").colspan(5);
                    t.row();
                    t.label(() => Core.bundle.format("mapInfo.unitCapacity", state.rules.unitCap) + (state.rules.unitCapVariable ? "+" + String.fromCharCode(Iconc.blockCoreShard) : "")).colspan(5);
                }));
                trule.table(cons(t => {
                    t.label(() => "@mapInfo.buildingHpMutil").pad(2);
                    t.label(() => "@mapInfo.buildingDamageMutil").pad(2);
                    t.label(() => "@mapInfo.unitDamageMutil").pad(2);
                    t.label(() => "@mapInfo.buildCostMutil").pad(2);
                    t.label(() => "@mapInfo.buildSpeedMutil").pad(2);
                    t.label(() => "@mapInfo.buildRefundMutil").pad(2);
                    t.label(() => "@mapInfo.unitConstructSpeedMutil").pad(2);
                    t.row();
            
                    t.label(() => "" + fixNum(state.rules.blockHealthMultiplier, 2)).pad(2);
                    t.label(() => "" + fixNum(state.rules.blockDamageMultiplier, 2)).pad(2);
                    t.label(() => "" + fixNum(state.rules.unitDamageMultiplier, 2)).pad(2);
                    t.label(() => "" + fixNum(state.rules.buildCostMultiplier, 2)).pad(2);
                    t.label(() => "" + fixNum(state.rules.buildSpeedMultiplier, 2)).pad(2);
                    t.label(() => "" + fixNum(state.rules.deconstructRefundMultiplier, 2)).pad(2);
                    t.label(() => "" + fixNum(state.rules.unitBuildSpeedMultiplier, 2)).pad(2);
                }));

                /* Stats */
                twave.table(cons(t => {
                    t.label(() => (control.saves.getCurrent() != null ? ("Time: " + control.saves.getCurrent().getPlayTime() + "\n"):"") + 
                    "Kill: " + state.stats.enemyUnitsDestroyed).pad(5);
                    t.label(() => "Build: " + state.stats.buildingsBuilt + 
                    "\nDescons: " + state.stats.buildingsDeconstructed + 
                    "\nDestroy: " + state.stats.buildingsDestroyed).pad(5);
                })).left();
                twave.row();
    
                twave.label(() => Core.bundle.format("mapInfo.wave", state.wave));
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
                                    t.image(group.effect.uiIcon).size(iconMed).scaling(Scaling.fit);
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

                tmap.add("@mapInfo.team").padLeft(5).padRight(5);
                tmap.add("@mapInfo.unitConstructSpeedMutil").padLeft(5).padRight(5);
                tmap.add("@mapInfo.unitDamageMutil").padLeft(5).padRight(5);
                tmap.add("@mapInfo.buildingHpMutil").padLeft(5).padRight(5);
                tmap.add("@mapInfo.buildingDamageMutil").padLeft(5).padRight(5);
                tmap.add("@mapInfo.buildSpeedMutil").padLeft(5).padRight(5);
                tmap.add("@mapInfo.infAmmo").padLeft(5).padRight(5);
                tmap.add("@mapInfo.infRes").padLeft(5).padRight(5);
                tmap.add("@mapInfo.cheat").padLeft(5).padRight(5);
                tmap.add("@mapInfo.ai").padLeft(5).padRight(5);
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
                    tmap.add("" + (teamRule.ai ? Core.bundle.format("mapInfo.aiAndTier", teamRule.aiTier) + (teamRule.aiCoreSpawn ? "" + Core.bundle.format("mapInfo.aiCoreSpawn") : "") : "")).color(teamData.team.color);
                }
            }
        });
        mapInfoD.setup();
        mapInfoD.show();
    }
}

function fixNum(numObj, n){
    return (numObj + 0).toFixed(n);
}