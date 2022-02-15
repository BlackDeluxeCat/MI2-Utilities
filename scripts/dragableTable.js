let currTopmost = null;
module.exports={
    new:function(titleText){
        let table = extend(Table, Styles.flatDown, {
            curx : 0, cury : 0, fromx : 0, fromy : 0,
            titleText : null, titleButtons : null, cont : new Table(),
            topmost : false, minimized : false, closable : true,

            rebuild(){
                this.clear();
                this.setupTitle();
                this.row();
                try{
                    /** rebuild cont table */
                    this.rebuildCont();
                }catch(e){};
                if(!this.minimized) this.add(this.cont).colspan(2);
            },

            setupTitle(){
                let title = new Label(this.titleText);
                this.add(title).update(() => {
                    this.curx = Mathf.clamp(this.curx, 0, (this.hasParent ? this.parent.getWidth() : Core.graphics.getWidth()) - this.getWidth());
                    this.cury = Mathf.clamp(this.cury, 0, (this.hasParent ? this.parent.getHeight() : Core.graphics.getHeight()) - this.getHeight());
                    this.setPosition(this.curx, this.cury);
                    this.keepInStage();
                    this.invalidateHierarchy();
                    this.pack();
                    if(this == currTopmost) this.setZIndex(1000);
                }).growX().fillY();
                title.setAlignment(Align.center);
                title.addListener(extend(InputListener, {
                    touchDown(event, x, y, pointer, button){
                        table.fromx = x;
                        table.fromy = y;
                        return true;
                    },
                    touchDragged(event, x, y, pointer){
                        let v = table.localToStageCoordinates(Tmp.v1.set(x, y));
                        table.curx = v.x - table.fromx;
                        table.cury = v.y - table.fromy;
                    }
                }));

                this.titleButtons = new Table();
                this.titleButtons.button(String.fromCharCode(Iconc.refresh), Styles.cleart, () => {
                    this.rebuild();
                }).size(36, 36);
                this.titleButtons.button(String.fromCharCode(Iconc.lock), Styles.clearToggleMenut, () => {
                    this.topmost = !this.topmost;
                    if(this.topmost){
                        currTopmost = this;
                    }else{
                        if(currTopmost == this) currTopmost = null;
                    }
                    this.rebuild();
                }).size(24, 24).update(b => {
                    this.topmost = currTopmost == this;
                    b.setChecked(this.topmost);
                });;
                this.titleButtons.button("-", Styles.clearToggleMenut, () => {
                    this.minimized = !this.minimized;
                    this.rebuild();
                }).size(24, 24).update(b => {
                    b.setChecked(this.minimized);
                });
                this.titleButtons.button("X", Styles.cleart, () => {
                    this.setShow(false);
                }).size(24, 24).update(b => {
                    b.setDisabled(!this.closable);
                });
                this.add(this.titleButtons);
            },

            setShow(state){
                if(state == true){
                    Core.scene.add(this);
                }else{
                    this.remove();
                }
            },
            
            getShow(){
                if(this.hasParent()) return true;
                return false;
            }
        });



        table.titleText = titleText;
        table.margin(4);
        table.rebuild();

        return table;
    }
}