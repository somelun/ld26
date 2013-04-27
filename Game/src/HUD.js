var HudLayer = cc.Layer.extend({
	label:null,

	init:function() {
		this._super();

		this.label = cc.LabelTTF.create("000.0", "Arial", 16);
        this.label.setPosition(cc.p(900, 600));
        this.addChild(this.label, 5);
	},
});