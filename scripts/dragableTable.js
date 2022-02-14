module.exports={
    new:function(titleText){
        let table = extend(Table, Styles.flatDown, {
            curx : 0, cury : 0, fromx : 0, fromy : 0, titleText : null,
            clear(){
                this.super$clear();
                let title = new Label(this.titleText);
                this.add(title).update(() => {
                    this.curx = Mathf.clamp(this.curx, 0, (this.hasParent ? this.parent.getWidth() : Core.graphics.getWidth()) - this.getWidth());
                    this.cury = Mathf.clamp(this.cury, 0, (this.hasParent ? this.parent.getHeight() : Core.graphics.getHeight()) - this.getHeight());
                    this.setPosition(this.curx, this.cury);
                    this.keepInStage();
                    this.invalidateHierarchy();
                    this.pack();
                }).growX();
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
                this.row()
            }
        });

        table.titleText = titleText;
        table.margin(4);

        return table;
    }
}