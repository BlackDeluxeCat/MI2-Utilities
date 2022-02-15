const drag = require("dragableTable");
const mapInfo = require("mapinfo");
const healthBar = require("healthBar");
const logicHelper = require("logicHelper");
const emojis = require("emoji");
var enUnitHealthBar = false;

Events.on(EventType.ClientLoadEvent, e => {
    const buttonStyleTogglet = Styles.clearToggleMenut;
    const buttonStyle = Styles.cleart;
    var funcSetTextb = c => {c.getLabel().setWrap(false);c.getLabelCell().pad(6)};

    const dragTable = drag.new("@main.MI2U");
    dragTable.name = "MI2U_Main";
    dragTable.closable = false;
    dragTable.setShow(true);
    initModules();

    dragTable.left().bottom();

    dragTable.cont.table(cons(t => {
        t.table(cons(sqb => {
            sqb.button(String.fromCharCode(Iconc.refresh), buttonStyle, () => {
                Call.sendChatMessage("/sync");
            }).with(funcSetTextb);
        
            sqb.button("@main.buttons.rebuild", buttonStyle, () => {
                unitRebuildBlocks();
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

            tt.button("@main.buttons.emoji", buttonStyleTogglet, () => {
                emojis.setShow(!emojis.getShow());
            }).update(b => {
                b.setChecked(emojis.getShow());
            }).with(funcSetTextb);
        }));

    })).get().background(Styles.black6);
});

function unitRebuildBlocks(){
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

function initModules(){
    logicHelper.init();
    emojis.init();
}

Events.run(Trigger.draw, () => {
    if(!Vars.state.isGame() || !enUnitHealthBar) return;
    healthBar.drawAll();
});