var lhTable = null, varsTable = null;
var field = null, exec = null, lastexec = null, lastvarslen = 0;
var split = "", depth = 2;
var textbStyle;
module.exports={
    init:function(){
        textbStyle = Styles.nonet;
        lhTable = extend(Table, Styles.flatDown, {
            curx : 0, cury : 0, fromx : 0, fromy : 0,
            rebuild(){
                this.clear();
                this.table(cons(t => {
                    t.clear();
                    var title = new Label("@logicHelper.MI2U");
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
                        let f = tt.field(split, Styles.nodeField, () => {
                            split = f.getText();
                            rebuildVars(varsTable);
                        }).get();
                        f.setMessageText("@logicHelper.splitField.msg");
                        tt.button(String.fromCharCode(Iconc.refresh), Styles.cleart, () => {
                            this.rebuild();
                        }).size(36, 36);
                    }));

                    t.row();

                    varsTable = new Table();
                    rebuildVars(varsTable);
                    t.pane(varsTable).maxSize(Core.graphics.getWidth() / 2, Core.graphics.getHeight() / 2).growX();
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
            lhTable.curx = Mathf.clamp(lhTable.curx, 0, (lhTable.hasParent ? lhTable.parent.getWidth() : Core.graphics.getWidth()) - lhTable.getWidth());
            lhTable.cury = Mathf.clamp(lhTable.cury, 0, (lhTable.hasParent ? lhTable.parent.getHeight() : Core.graphics.getHeight()) - lhTable.getHeight());
            lhTable.setPosition(lhTable.curx, lhTable.cury);
            lhTable.keepInStage();
            lhTable.invalidateHierarchy();
            lhTable.pack();
            if(lastexec != null && lastvarslen != exec.vars.length || exec != lastexec){
                rebuildVars(varsTable);
                lastexec = exec;
                lastvarslen = exec.vars.length;
            }
        });
    }

    
}


function rebuildVars(tt){
    tt.clear();
    if(exec != null){
        if(split != ""){
            deepSplit(tt, depth);
        }else{
            for(let vi = 0; vi < exec.vars.length; vi++){
                let lvar = exec.vars[vi];
                tt.button(lvar.name, textbStyle, () => {
                    Core.app.setClipboardText(lvar.name);
                }).growX().get().getLabel().setAlignment(Align.left);
                tt.row();
            }
        }
    }
}

function deepSplit(t, d){
    let seq = new Seq();
    exec.vars.forEach(v => {
        if(v.constant && v.name.startsWith("___")) return;
        seq.add(v.name);
    });

    seq.sort();

    seq.each(name => {
        t.button(String.fromCharCode(Iconc.paste), textbStyle, () => {
            Core.app.setClipboardText(name);
        }).size(24,24).pad(2);

        let blocks = name.split(split, d);
        for(let bi = 0; bi < Math.min(d, blocks.length); bi++){
            let str = blocks[bi] + (bi == blocks.length - 1 ? "":split);
            t.button(str, textbStyle, () => {
                Core.app.setClipboardText(str);
            }).fillX().pad(2).width(100).get().getLabel().setAlignment(Align.left);
        }
        /*
        t.button(name, textbStyle, () => {
            Core.app.setClipboardText(name);
        });
        */
        t.row();
    })
}