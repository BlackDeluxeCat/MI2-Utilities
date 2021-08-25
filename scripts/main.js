require("MI2Settings")


Time.run(1,run(() => {
    const dragTable = extend(Table, {
        curx : 50, cury : 10, flip : true
    });
    dragTable.left().bottom().marginLeft(dragTable.curx).marginRight(dragTable.cury);
    dragTable.label(() => "MI2U");
    dragTable.row();
    dragTable.label(() => "0.1.0");
    dragTable.row();
    dragTable.button(Icon.refreshSmall, () => {
        Call.sendChatMessage("/sync");
    }).maxSize(36, 36);
    Core.scene.add(dragTable);
}));
