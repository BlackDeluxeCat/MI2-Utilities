const mapInfo = require("mapinfo");
const healthBar = require("healthBar");
const logicHelper = require("logicHelper");
var enUnitHealthBar = false, enLogicHelper = false;

Events.on(EventType.ClientLoadEvent, e => {
    const buttonStyleTogglet = Styles.clearToggleMenut;
    const buttonStyle = Styles.cleart;
    var funcSetTextb = c => {c.getLabel().setWrap(false);c.getLabelCell().pad(6)};

    const dragTable = extend(Table, {
        curx : 100, cury : 200, fromx : 0, fromy : 0
    });
    dragTable.name = "MI2U_Main";
    Vars.ui.hudGroup.addChild(dragTable);

    dragTable.left().bottom();
    dragTable.update(() => {
        dragTable.curx = Mathf.clamp(dragTable.curx, 0, Core.graphics.getWidth() - 100 - dragTable.getWidth());
        dragTable.cury = Mathf.clamp(dragTable.cury, 0, Core.graphics.getHeight() - 100 - dragTable.getHeight());
        dragTable.setPosition(dragTable.curx, dragTable.cury);
    }); 

    dragTable.table(cons(t => {
        var titleLabel = new Label("@main.MI2U");
        titleLabel.setAlignment(Align.center);
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
        
        t.add(titleLabel).center().fillX();
        t.row();

        t.table(cons(sqb => {
            sqb.button(String.fromCharCode(Iconc.refresh), buttonStyle, () => {
                Call.sendChatMessage("/sync");
            }).with(funcSetTextb);
        
            sqb.button("@main.buttons.rebuild", buttonStyle, () => {
                rebuildBlocks();
            }).with(funcSetTextb);
        }));
        
        t.row();

        t.table(cons(rqb =>  {      
            rqb.button("@main.buttons.mapInfo", buttonStyle, () => {
                mapInfo.show();
            }).with(funcSetTextb);
        }));

        t.row();

        //hhh the hell of effect buttons
        t.table(cons(tt => {
            tt.button("@main.buttons.unitHpBar", buttonStyleTogglet, () => {
                enUnitHealthBar = !enUnitHealthBar;
            }).update(b => {
                b.setChecked(enUnitHealthBar);
            }).with(funcSetTextb);

            /*
            tt.button("@main.buttons.logic", buttonStyleTogglet, () => {
                enLogicHelper = !enLogicHelper;
            }).update(b => {
                b.setChecked(enLogicHelper);
            }).size(48,36);
            */
        }));

    })).get().background(Styles.black6);

    logicHelper.init();
});

function rebuildBlocks(){
    var player = Vars.player;
    if(!player.unit().canBuild()) return;
    var p = 0;
    for(let bpid = 0; bpid < Vars.state.teams.get(player.team()).blocks.size; bpid++){
        let block = Vars.state.teams.get(player.team()).blocks.get(bpid);
        if(Mathf.len(block.x - player.tileX(), block.y - player.tileY()) >= 200) continue;
        p++;
        if(p > 511) break;
        player.unit().addBuild(new BuildPlan(block.x, block.y, block.rotation, Vars.content.block(block.block), block.config));
    }
}

Events.run(Trigger.draw, () => {
    if(!Vars.state.isGame() || !enUnitHealthBar) return;
    healthBar.drawAll();
});