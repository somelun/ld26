var EndLayer = cc.Layer.extend({

	init:function() {
		this._super();

		var s = cc.Sprite.create(s_end);
		s.setAnchorPoint(cc.PointMake(0.0, 0.0));
		// s.setPosition(480, 320);
		this.addChild(s);

		this.setKeyboardEnabled(true);

		return true;
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