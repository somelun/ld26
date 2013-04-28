var SplashLayer = cc.Layer.extend({

	
	init:function() {
		this._super();

		var s = cc.Sprite.create(s_splash);
		s.setAnchorPoint(cc.PointMake(0.0, 0.0));
		s.setPosition(480, 320);
		this.addChild(s);

		var start_n = cc.Sprite.create(s_start_n);
        var start_s = cc.Sprite.create(s_start_s);

		var startGameee = cc.MenuItemSprite.create(start_n, start_s, this.startGame, this);

		var menu = cc.Menu.create(startGameee);
        this.addChild(menu, 102, 200);
        menu.setPosition(700, 100);
	},

	startGame:function() {
	// 	var scene = cc.Scene.create();
 //        scene.addChild(GameScene.create());
 //        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
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