var GameLayer = cc.Layer.extend({
	map:null,
	hero:null,

	init:function() {
		this._super();

		this.schedule(this.update);

		return true;
	},

	update:function(dt) {
		//
	},

	onKeyDown:function(keyCode) {
		switch(keyCode) {
			case cc.KEY.right: {
				//
				break;
			}
			case cc.KEY.left: {
				//
				break;
			}
			case cc.KEY.space: {
				//
				break;
			}
			case cc.KEY.x: {
				//
				break;
			}
		}
	},

	onKeyUp:function() {
		switch(keyCode) {
			case cc.KEY.right: {
				//
				break;
			}
			case cc.KEY.left: {
				//
				break;
			}
			case cc.KEY.space: {
				//
				break;
			}
			case cc.KEY.x: {
				//
				break;
			}
		}
	},

});

var GameScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var layer = new GameLayer();
		layer.init();
		this.addChild(layer);
	}
});