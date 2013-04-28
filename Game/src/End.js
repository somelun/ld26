var EndLayer = cc.Layer.extend({

	init:function() {
		this._super();

		var s = cc.Sprite.create(s_end);
		s.setAnchorPoint(cc.PointMake(0.0, 0.0));
		// s.setPosition(480, 320);
		this.addChild(s);

		var score = cc.Director.getInstance().score;
		this.label = cc.LabelTTF.create("" + Number(score).toFixed(2), "Arial", 36);
        this.label.setPosition(cc.p(750, 150));
        this.addChild(this.label, 5);

		this.setKeyboardEnabled(true);

		return true;
	},

	onKeyDown:function(keyCode) {
		switch(keyCode) {
			case cc.KEY.r: {
				this.startGame();
			}
		}
	},

	startGame:function() {
		var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
	},

});

EndLayer.create = function ()  {
    var sg = new EndScene();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

var EndScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new EndLayer();
        layer.init();
        this.addChild(layer);

    }
});