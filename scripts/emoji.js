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
        emojiTable.update(() => emojiTable.setZIndex(1000));
        emojiTable.listMode = false;
        emojiTable.minimized = false;
        emojiTable.rebuild = function(){
            this.clear();
            this.table(cons(t => {
                t.table(cons(tt => {
                    tt.button(String.fromCharCode(Iconc.refresh), Styles.cleart, () => {
                        this.rebuild();
                    }).size(36, 36);
                    tt.button(String.fromCharCode(Iconc.list), Styles.clearToggleMenut, () => {
                        this.listMode = !this.listMode;
                        this.rebuild();
                    }).size(36, 36).update(b => {
                        b.setChecked(this.listMode);
                    });
                    tt.button("-", Styles.cleart, () => {
                        this.minimized = !this.minimized;
                        this.rebuild();
                    }).size(36, 36).update(b => {
                        b.setChecked(this.minimized);
                    });
                    tt.button("X", Styles.cleart, () => {
                        setShow(false);
                    }).size(36, 36);
                }));
                if(this.minimized) return;

                t.row();

                let field = java.lang.Class.forName("mindustry.ui.Fonts").getDeclaredField("stringIcons");
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
                })).maxSize(Core.graphics.getWidth() / 4, Core.graphics.getHeight() / 4);
            }));
        };
        emojiTable.rebuild();
    },

    setShow:function(state){
        setShow(state);
    },

    getShow:function(){
        return getShow();
    }
}

function setShow(state){
    if(state == true){
        Core.scene.add(emojiTable);
    }else{
        emojiTable.remove();
    }
}

function getShow(){
    if(emojiTable.hasParent()) return true;
    return false;
}