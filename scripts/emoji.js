const drag = require("dragableTable");
var emojiTable;
var textbStyle;
let tmpindex;
module.exports={
    init:function(){
        textbStyle = Styles.nonet;
        var funcSetTextb = c => {
            c.getLabel().setAlignment(Align.left)
            c.getLabel().setWrap(false);
            c.getLabelCell().pad(2)
        };
        emojiTable = drag.new("@emoji.MI2U");
        emojiTable.listMode = false;
        emojiTable.rebuildCont = function(){
            this.cont.clear();
            this.cont.table(cons(t => {
                t.table(cons(tt => {
                    tt.button(String.fromCharCode(Iconc.list), Styles.clearToggleMenut, () => {
                        this.listMode = !this.listMode;
                        this.rebuild();
                    }).size(36, 36).update(b => {
                        b.setChecked(this.listMode);
                    });
                }));
                if(this.minimized) return;

                t.row();

                let field;
                if(Vars.android){
                    field = java.lang.Class.forName("io.anuke.mindustry.ui.Fonts").getDeclaredField("stringIcons");
                }else{
                    field = java.lang.Class.forName("mindustry.ui.Fonts").getDeclaredField("stringIcons");
                }
                field.setAccessible(true);
                let map = field.get(null);
                
                t.pane(cons(tt => {
                    if(this.listMode){
                        map.each((name, emoji) => {
                            tt.button(name, textbStyle, () => {
                                Core.app.setClipboardText(name);
                            }).growX().with(funcSetTextb);
                            tt.button(emoji, textbStyle, () => {
                                Core.app.setClipboardText(emoji);
                            }).growX().with(funcSetTextb);
                            tt.row();
                        });
                    }else{
                        tmpindex = 0;
                        map.each((name, emoji) => {
                            let cell = tt.button(emoji, textbStyle, () => {
                                Core.app.setClipboardText(emoji);
                            }).growX().with(funcSetTextb);
                            if(++tmpindex > 8){
                                tt.row();
                                tmpindex = 0;
                            }
                        });
                    }
                })).maxHeight(Core.graphics.getHeight() / 3).growX();
            }));
        };
        emojiTable.rebuildCont();
    },

    setShow:function(state){
        emojiTable.setShow(state);
    },

    getShow:function(){
        return emojiTable.getShow();
    }
}