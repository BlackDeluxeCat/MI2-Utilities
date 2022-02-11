var lhTable = null;
var field = null, exec = null, lastexec = null;
var split = "";

module.exports={
    init:function(){
        lhTable = extend(Table, Styles.flatDown, {
            curx : 0, cury : 0, fromx : 0, fromy : 0,
            rebuild(){
                this.clear();
                this.table(cons(t => {
                    t.clear();
                    var title = new Label("Logic Helper");
                    title.setAlignment(Align.center);
                    title.addListener(extend(InputListener, {
                        touchDown(event, x, y, pointer, button){
                            lhTable.fromx = x;
                            lhTable.fromy = y;
                            return true;
                        },
                        touchDragged(event, x, y, pointer){
                            let v = lhTable.localToStageCoordinates(Tmp.v1.set(x, y));
                            lhTable.curx = v.x - lhTable.fromx;
                            lhTable.cury = v.y - lhTable.fromy;
                        }
                    }));
                    t.table(cons(tt => {
                        tt.add(title).growX();
                        tt.button(String.fromCharCode(Iconc.refresh), Styles.cleart, () => {
                            this.rebuild();
                        }).size(36, 36);
                    }));


                    t.row();

                    if(exec != null){
                        t.pane(cons(tt => {
                            for(let vi = 0; vi < exec.vars.length; vi++){
                                let lvar = exec.vars[vi];
                                tt.button(lvar.name, Styles.nodet, () => {
                                    Core.app.setClipboardText(lvar.name);
                                }).growX();
                                tt.row();
                            }
                        })).maxSize(Core.graphics.getWidth() / 3, Core.graphics.getHeight() / 3).growX();
                    }

                }));
            }
        });

        var dialog = Vars.ui.logic;
        dialog.addChild(lhTable);
        field = dialog.getClass().getDeclaredField("executor");
        field.setAccessible(true);
        dialog.update(() => {
            exec = field.get(dialog);
        });

        lhTable.rebuild();
        lhTable.left().top().margin(4);
        lhTable.update(() => {
            lhTable.keepInStage();
            lhTable.invalidateHierarchy();
            lhTable.pack();
            lhTable.curx = Mathf.clamp(lhTable.curx, 0, (lhTable.hasParent ? lhTable.parent.getWidth() : Core.graphics.getWidth()) - lhTable.getWidth());
            lhTable.cury = Mathf.clamp(lhTable.cury, 0, (lhTable.hasParent ? lhTable.parent.getHeight() : Core.graphics.getHeight()) - lhTable.getHeight());
            lhTable.setPosition(lhTable.curx, lhTable.cury);
            if(exec != lastexec){
                lhTable.rebuild();
                lastexec = exec;
            }
        });
    }

    
}