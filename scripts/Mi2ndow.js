let currTopmost = null;
let titleStyleNormal, titleStyleSnapped;
/**  
 * Mi2ndow is a dragable Table that partly works like a window. 
 * cont is a container for user items. 
 * rebuildCont() can be set(with js) as a member method, which will be called when rebuild().
 * @author BlackDeluxeCat
 */
module.exports={
    new:function(titleText){
        titleStyleNormal = new Label.LabelStyle(Fonts.def, new Color(0.8,0.9,1,1));
        titleStyleSnapped = new Label.LabelStyle(Fonts.def, new Color(0.1,0.6,0.6,1));

        let table = extend(Table, Styles.flatDown, {
            curx : 0, cury : 0, fromx : 0, fromy : 0, aboveSnap : null,
            titleText : null, titleButtons : null, customInfo : "", cont : new Table(),
            topmost : false, minimized : false, infoview : false, closable : true, 

            rebuild(){
                this.clear();
                this.setupTitle();
                this.row();
                try{
                    /** rebuild cont table */
                    this.rebuildCont();
                }catch(e){};
                if(!this.minimized) this.add(this.infoview ? 
                    new Table(cons(t => {
                        t.pane(cons(tt => {
                            tt.add(String.fromCharCode(Iconc.info) + " " + Core.bundle.format("mi2ndow.customInfoTitle")).pad(4).width(Core.graphics.getWidth() / 3).get().setWrap(true);
                            tt.row();
                            tt.add(this.customInfo).width(Core.graphics.getWidth() / 3).padBottom(8).get().setWrap(true);
                            tt.row();
                            tt.add(String.fromCharCode(Iconc.info) + " " + Core.bundle.format("mi2ndow.uiInfoTitle")).pad(4).width(Core.graphics.getWidth() / 3).get().setWrap(true);
                            tt.row();
                            tt.add("@mi2ndow.uiInfo").width(Core.graphics.getWidth() / 3).get().setWrap(true);
                        })).maxHeight(200).growX().update(p => {
                            let e = Core.scene.hit(Core.input.mouseX(), Core.input.mouseY(), true);
                            if(e != null && e.isDescendantOf(p)){
                                p.requestScroll();
                            }else if(p.hasScroll()){
                                Core.scene.setScrollFocus(null);
                            }
                        });
                    })) : this.cont).colspan(2);
            },

            setupTitle(){
                let title = new Label(this.titleText);
                this.add(title).update(() => {
                    this.curx = Mathf.clamp(this.curx, 0, (this.hasParent ? this.parent.getWidth() : Core.graphics.getWidth()) - this.getWidth());
                    this.cury = Mathf.clamp(this.cury, 0, (this.hasParent ? this.parent.getHeight() : Core.graphics.getHeight()) - this.getHeight());
                    if(this.aboveSnap != null){
                        this.curx = this.aboveSnap.jsSelf().curx;
                        this.cury = this.aboveSnap.jsSelf().cury - this.getHeight();
                    }
                    this.setPosition(this.curx, this.cury);
                    this.keepInStage();
                    this.invalidateHierarchy();
                    this.pack();
                    if(this == currTopmost || this.shouldTopMost()) this.setZIndex(1000);
                    title.setStyle(this.aboveSnap == null ? titleStyleNormal : titleStyleSnapped);
                }).growX().fillY();
                title.name = "Mindow";
                title.setAlignment(Align.center);
                title.addListener(extend(InputListener, {
                    touchDown(event, x, y, pointer, button){
                        table.fromx = x;
                        table.fromy = y;
                        return true;
                    },
                    touchDragged(event, x, y, pointer){
                        let v = table.localToStageCoordinates(Tmp.v1.set(x, y));
                        let hit = Core.scene.hit(v.x + title.x, v.y + title.y, false);
                        if(hit != null && hit.hasParent() && hit.name == "Mindow" && hit != title && hit.parent.jsSelf().aboveSnap != table){
                            table.aboveSnap = hit.parent;
                        }else{
                            table.aboveSnap = null;
                            table.curx = v.x - table.fromx;
                            table.cury = v.y - table.fromy;
                        }
                    }
                }));

                this.titleButtons = new Table();
                this.titleButtons.button(String.fromCharCode(Iconc.info), Styles.clearToggleMenut, () => {
                    this.infoview = !this.infoview;
                    this.rebuild();
                }).size(24, 24).update(b => {
                    this.topmost = currTopmost == this;
                    b.setChecked(this.infoview);
                });
                this.titleButtons.button(String.fromCharCode(Iconc.refresh), Styles.cleart, () => {
                    this.rebuild();
                }).size(24, 24);
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
                });
                this.titleButtons.button("-", Styles.clearToggleMenut, () => {
                    this.minimized = !this.minimized;
                    this.rebuild();
                    if(this.minimized){
                        this.cury += this.cont.getHeight();
                    }else{
                        this.cury -= this.cont.getHeight();
                    }
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
            
            /** @return the js-extended-table, not arc.scene.ui.layout.Table */
            jsSelf(){
                return table;
            },

            shouldTopMost(){
                return (this.topmost || (this.aboveSnap !=null && this.aboveSnap.shouldTopMost()));
            },

            /** control Mi2ndow's show. TODO add target parent sooner
             * @param state if true, set the parent to Core.scene.root. if false, do this.remove() */
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