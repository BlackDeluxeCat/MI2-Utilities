const drag = require("ui/Mi2ndow");
var teamTable, gamestate, core;
var lastItemsAmt, lastLastItemsAmt, interval;
module.exports={
    init:function(){
        var content = Vars.content;
        var iconSmall = Vars.iconSmall;


        lastItemsAmt = new ObjectIntMap(); 
        lastLastItemsAmt = new ObjectIntMap(); 
        interval = new Interval();

        teamTable = drag.new("@teamInfo.MI2U");
        teamTable.customInfo = "@teamInfo.info";
        teamTable.rebuildCont = function(){
            this.cont.update(() => {
                if(gamestate != Vars.state.isGame()){
                    teamTable.rebuildCont();
                    gamestate = Vars.state.isGame();
                }

                core = Vars.player.team().core();

                if(Vars.state.isGame() && core != null && interval.get(60)){
                    content.items().each(item => {
                        lastLastItemsAmt.put(item, lastItemsAmt.get(item));
                        lastItemsAmt.put(item, core.items.get(item));
                    });
                }
            });

            let i = 0;

            
            this.cont.clear();
            content.items().each(item => {
                this.cont.stack(
                    new Image(item.uiIcon),
                    new Table(cons(t => t.label(() => core == null ? "" : (lastItemsAmt.get(item) - lastLastItemsAmt.get(item) >= 0 ? "[green]+" : "[red]") + (lastItemsAmt.get(item) - lastLastItemsAmt.get(item))).get().setFontScale(0.6))).right().bottom()
                    ).size(iconSmall).padRight(3).tooltip(cons(t => t.background(Styles.black6).margin(4).add(item.localizedName).style(Styles.outlineLabel)));
                //image(item.uiIcon).size(iconSmall).padRight(3).tooltip(t => t.background(Styles.black6).margin(4).add(item.localizedName).style(Styles.outlineLabel));
                //TODO leaks garbage
                this.cont.label(() => core == null ? "0" : 
                    UI.formatAmount(core.items.get(item)))
                .padRight(3).minWidth(52).left();

                if(++i % 4 == 0){
                    this.cont.row();
                }
                
            });

            //unittypes in a new line
            i = 0;
            this.cont.row();

            content.units().each(type => {
                this.cont.image(type.uiIcon).size(iconSmall).padRight(3).tooltip(cons(t => t.background(Styles.black6).margin(4).add(type.localizedName).style(Styles.outlineLabel)));
                this.cont.label(() => core == null ? "0" : UI.formatAmount(core.team.data().countType(type))).padRight(3).minWidth(52).left();

                if(++i % 5 == 0){
                    this.cont.row();
                }
            });
        };
        teamTable.rebuildCont();
    },

    setShow:function(state){
        teamTable.setShow(state);
    },

    getShow:function(){
        return teamTable.getShow();
    }
}