var SplashLayer = cc.Layer.extend({

	
	init:function() {
		this._super();

		var s = cc.Sprite.create(s_splash);
		s.setAnchorPoint(cc.PointMake(0.0, 0.0));
		this.addChild(s);

		var start_n = cc.Sprite.create(s_start_n);
        var start_s = cc.Sprite.create(s_start_s);

		var startGameee = cc.MenuItemSprite.create(start_n, start_s, this.startGame, this);

		var menu = cc.Menu.create(startGameee);
        this.addChild(menu, 102, 200);
        menu.setPosition(700, 100);

        this.setKeyboardEnabled(true);

        return true;
	},

	startGame:function() {
		var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
	},

	onKeyDown:function(keyCode) {
		switch(keyCode) {
			case cc.KEY.space: {
				this.startGame();
			}
		}
	},

});

var SplashScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new SplashLayer();
        layer.init();
        this.addChild(layer);

    }
});