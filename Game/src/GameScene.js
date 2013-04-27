var GameLayer = cc.Layer.extend({
	map:null,
	hero:null,

	init:function() {
		this._super();

		var sky = cc.LayerColor.create(cc.c4(49, 162, 238, 255));
        this.addChild(sky, -1);

        this.map = cc.TMXTiledMap.create(s_map_plist);
        this.addChild(this.map, 0, 123);

		this.schedule(this.update);

		return true;
	},

	update:function(dt) {
		//
	},

	onKeyDown:function(keyCode) {
		switch(keyCode) {
			case cc.KEY.right: {
				this.hero.movementType = kRightMove;
				break;
			}
			case cc.KEY.left: {
				this.hero.movementType = kLeftMove;
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
				this.hero.movementType = kStop;
				break;
			}
			case cc.KEY.left: {
				this.hero.movementType = kStop;
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