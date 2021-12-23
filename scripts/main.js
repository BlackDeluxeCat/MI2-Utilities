require("MI2Settings")
const version = "0.1.0";


Events.on(EventType.ClientLoadEvent, e => {
    const UIHudGroup = Vars.ui.hudGroup;
    const dragTable = extend(Table, {
        curx : 100, cury : 200, flip : true, fromx : 0, fromy : 0
    });
    dragTable.name("MI2U_Main")
    UIHudGroup.addChild(dragTable);

    dragTable.left().bottom().setFillParent(true);
    dragTable.update(() => {
        dragTable.setPosition(dragTable.curx, dragTable.cury);
    });
    

    var titleLabel = new Label("MI2U");
    titleLabel.addListener(extend(InputListener, {
        touchDown(event, x, y, pointer, button){
            dragTable.fromx = x;
            dragTable.fromy = y;
            return true;
        },
        touchDragged(event, x, y, pointer){
            let v = dragTable.localToStageCoordinates(Tmp.v1.set(x, y));
            dragTable.curx = v.x - dragTable.fromx;
            dragTable.cury = v.y - dragTable.fromy;
        }
    }));
    
    dragTable.add(titleLabel);
    dragTable.row();
    dragTable.label(() => "" + version);
    dragTable.row();
    dragTable.button(Icon.refreshSmall, () => {
        Call.sendChatMessage("/sync");
    }).size(36, 36);
    
});