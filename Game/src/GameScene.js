var GameLayer = cc.Layer.extend({
	//
});

var GameScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var layer = new GameLayer();
		layer.init();
		this.addChild(layer);
	}
});