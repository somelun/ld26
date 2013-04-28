
var GameLayer = cc.Layer.extend({
    isMouseDown:false,
    map:null,
    walls:null,
    hero:null,
    sky:null,
    baloon:null,
    bullet:null,
    time:0,
    hud:null,
    balloonIsBoom:false,
    timeBoom:0,

    init:function () {

        this._super();

        // cc.AudioEngine.getInstance().playMusic(s_song, true);

		var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_objects_plist);

		var sky = cc.LayerColor.create(cc.c4(49, 162, 238, 255), 2560, 640);
        this.addChild(sky, -1);

        this.map = cc.TMXTiledMap.create(s_map_plist);
        this.addChild(this.map, 0, 123);

        this.walls = this.map.getLayer("walls");

        this.hero = new Hero();
        this.hero.initWithSpriteFrameName("duck_1.png");
        this.hero.setPosition(cc.p(130, 300));
        this.addChild(this.hero, 1, 700);
        this.hero.initPlayerAnimation();

        this.baloon = new Baloon();
        this.baloon.initWithSpriteFrameName("baloon_1.png");
        this.baloon.setPosition(cc.p(330, 100));
        this.addChild(this.baloon, 10, 600);
        this.baloon.initPlayerAnimation();

        var b = new Bullet();
        b.initWithSpriteFrameName("bullet.png");
        b.setPosition(cc.p(30, 5));
        this.hero.addChild(b, 10, 500);

        var s = cc.Sprite.create();
        s.initWithSpriteFrameName("sun.png");
        s.setPosition(cc.p(300, 500));
        this.addChild(s, -1);

        this.setKeyboardEnabled(true);

		this.schedule(this.update);

        return true;
    },

    update:function(dt) {
        this.hero.update(dt);
        this.checkForAndResolveCollisions(this.hero);
        this.setViewpointCenter(this.hero.getPosition());

        // if (!this.baloon._isMoveActivated) {
        // 	this.baloon.runBezier();
        // }

        if (this.bullet != null) {
        	//bullet and balloon
        	var bulletRect = cc.RectMake(this.bullet.getPosition().x, this.bullet.getPosition().y, this.bullet.getContentSize().width, this.bullet.getContentSize().height);
        	var baloonRect = cc.RectMake(this.baloon.getPosition().x, this.baloon.getPosition().y, this.baloon.getContentSize().width, this.baloon.getContentSize().height);
        	var intersection = cc.rectIntersection(bulletRect, baloonRect);
        	if (intersection.size.width > 0 && intersection.size.height > 0) {
        		cc.AudioEngine.getInstance().playEffect(s_expl);
        		this.baloon.stopPlayerAnimation();
        		this.baloon.playBoomAnimation();
        		this.runAction(cc.Sequence.create(cc.DelayTime.create(0.4), cc.CallFunc.create(this.removeBaloon, this)));
    			this.bullet = null;
    			this.balloonIsBoom = true;
    			return;
        	}

        // 	//bullet and hero
        // 	var heroRect = cc.RectMake(this.hero.getPosition().x, this.hero.getPosition().y, this.hero.getContentSize().width, this.hero.getContentSize().height);
        // 	intersection = cc.rectIntersection(bulletRect, heroRect);
        // 	if (intersection.size.width > 0 && intersection.size.height > 0) {
        // 		if (this.bullet.state == kShoot) {
        // 			cc.AudioEngine.getInstance().playEffect(s_expl);
	    			// this.removeChildByTag(700);
	    			// this.bullet = null;
	    			// return;
        // 		} else if (this.bullet.state == kOnTheStage) {
        // 			var b = this.bullet;
        // 			this.removeChildByTag(500);
        // 			this.bullet = null;
        // 			this.hero.removeAllChildrenWithCleanup(true);
        // 			this.hero.addChild(b, 10, 500);
        // 			b.setPosition(cc.p(30, 5));
        // 			this.hero.isBulletСharged = true;
        // 			return;
        // 		}
        // 	}

        }

       //  //baloon and hero
       //  var baloonRect = cc.RectMake(this.baloon.getPosition().x, this.baloon.getPosition().y, this.baloon.getContentSize().width, this.baloon.getContentSize().height);
       //  var heroRect = cc.RectMake(this.hero.getPosition().x, this.hero.getPosition().y, this.hero.getContentSize().width, this.hero.getContentSize().height);
       //  intersection = cc.rectIntersection(baloonRect, heroRect);
       //  if (intersection.size.width > 0 && intersection.size.height > 0) {
       //  		// cc.AudioEngine.getInstance().playEffect(s_expl);
    			// this.removeChildByTag(700); 
    			// return;
       //  }

        if (this.balloonIsBoom) {
       		this.timeBoom +=dt;
        } else {
        	this.time += dt;	//level complete time
	    	this.hud.label.setString("" + Number(this.time).toFixed(2));
        }

       	if (this.timeBoom > 2) {
       		this.showGameOver();
       	}

    },

    showGameOver:function() {
    	var scene = cc.Scene.create();
        scene.addChild(EndLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    removeBaloon:function() {
    	this.removeChildByTag(600);
    },

    //keys
    onKeyDown:function (keyCode) {
        switch(keyCode) {
            case cc.KEY.right: {
                this.hero.moveType = kMoveRight;
                this.hero.lastMoveType = kMoveRight;
                break;
            }
            case cc.KEY.left: {
                this.hero.moveType = kMoveLeft;
                this.hero.lastMoveType = kMoveLeft;
                break;
            }
            case cc.KEY.space: {
                this.hero.mightAsWellJump = true;
                break;
            }
            case cc.KEY.x: {
                this.fire();
            }
            default:
                break;
        }
    },

    onKeyUp:function (keyCode) {
        switch(keyCode) {
            case cc.KEY.right: {
                this.hero.moveType = kStop;
                break;
            }
            case cc.KEY.left: {
                this.hero.moveType = kStop;
                break;
            }
            case cc.KEY.space: {
                this.hero.mightAsWellJump = false;
                break;
            }
            case cc.KEY.x: {
            	//
            }
            default:
                break;
        }
    },

    //tiles
    tileCoordForPosition:function (position) {
        // if (gameOver) {
        //     return;
        // }
        
        var x = Math.floor(position.x / this.map.getTileSize().width);
        var levelHeightInPixels = this.map.getMapSize().height * this.map.getTileSize().height;
        var y = Math.floor((levelHeightInPixels - position.y) / this.map.getTileSize().height);
        return cc.PointMake(x, y);
    },

    tileRectFromTileCoords:function (tileCoords) {
        // if (gameOver) {
        //     return;
        // }

        var levelHeightInPixels = this.map.getMapSize().height * this.map.getTileSize().height;
        var origin = cc.PointMake(tileCoords.x * this.map.getTileSize().width, levelHeightInPixels - ((tileCoords.y + 1) * this.map.getTileSize().height));
        return cc.RectMake(origin.x, origin.y, this.map.getTileSize().width, this.map.getTileSize().height);
    },

    getSurroundingTilesAtPosition:function (p, layer) {
        // if (gameOver) {
        //     return;
        // }
        var position = p.getPosition();
        var plPos = this.tileCoordForPosition(position);    
        var gids = [];
    
        for (var i = 0; i < 9; i++) {
            var c = i % 3;
            var r =  Math.floor(i / 3);
            var tilePos = cc.PointMake(plPos.x + (c - 1), plPos.y + (r - 1)); 
        
            var tgid = layer.getTileGIDAt(tilePos);
        
            var tileRect = this.tileRectFromTileCoords(tilePos);
        
            var tileDict = {};
            tileDict["gid"] = tgid;
            tileDict["x"] = tileRect.origin.x;
            tileDict["y"] = tileRect.origin.y;
            tileDict["tilePos"] = tilePos;

            cc.ArrayAppendObject(gids, tileDict);
        }

        cc.ArrayRemoveObjectAtIndex(gids, 4);

        var obj1 = gids[0];        
        var obj2 = gids[1];        
        var obj3 = gids[2];        
        var obj4 = gids[3];        
        var obj5 = gids[4];        
        var obj6 = gids[5];        
        var obj7 = gids[6];        
        var obj8 = gids[7];        

        var gids2 = []; 
        cc.ArrayAppendObject(gids2, obj7);
        cc.ArrayAppendObject(gids2, obj2);
        cc.ArrayAppendObject(gids2, obj4);
        cc.ArrayAppendObject(gids2, obj5);
        cc.ArrayAppendObject(gids2, obj1);
        cc.ArrayAppendObject(gids2, obj3);
        cc.ArrayAppendObject(gids2, obj6);
        cc.ArrayAppendObject(gids2, obj8);

        return gids2;
    },

    checkForAndResolveCollisions:function (p) {
        // if (gameOver) {
        //     return;
        // }

        var tiles = this.getSurroundingTilesAtPosition(p, this.walls);
        p.onGround = false;

        for (var i = 0; i < tiles.length; i++) {
            var dic = tiles[i];
            var pRect = p.collisionBoundingBox();
            var gid = parseInt(dic["gid"]);
      
            if (gid) {
                
                var tileRect = cc.RectMake(parseFloat(dic["x"]), parseFloat(dic["y"]), this.map.getTileSize().width, this.map.getTileSize().height);

                if (cc.rectIntersectsRect(pRect, tileRect)) {
                    var intersection = cc.rectIntersection(pRect, tileRect);
                    var tileIndx = cc.ArrayGetIndexOfObject(tiles, dic);

                    if (tileIndx == 0 && p.velocity.y <= 0) {
                        //tile is directly below player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + intersection.size.height);
                        p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        p.onGround = true;
                    } else if (tileIndx == 1 && p.velocity.y >= 0) {
                        //tile is directly above player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y - intersection.size.height);
                        p.velocity = cc.PointMake(p.velocity.x, 0.0);
                    } else if (tileIndx == 2 && p.velocity.x <= 0) {
                        //tile is left of player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x + intersection.size.width, p.desiredPosition.y);
                        p.velocity = cc.PointMake(0.0, p.velocity.y);
                    } else if (tileIndx == 3 && p.velocity.x >= 0) {
                        //tile is right of player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x - intersection.size.width, p.desiredPosition.y);
                        p.velocity = cc.PointMake(0.0, p.velocity.y);
                    } else if (tileIndx == 6) {
                    	//tile is left bottom of player
                        var objLeft = tiles[2];
                        var gidLeft = parseInt(objLeft["gid"]);
                        if(gidLeft  && p.velocity.x <= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x + intersection.size.width, p.desiredPosition.y);
                            p.velocity = cc.PointMake(0.0, p.velocity.y);
                        }

                        var objBottom = tiles[0];
                        var gidBottom = parseInt(objBottom["gid"]);
                        if(gidBottom  && p.velocity.y <= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + intersection.size.height);
                            p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        }
                    } else if (tileIndx == 7) {
                        //tile is right bottom of player
                        var objRight = tiles[3];
                        var gidRight = parseInt(objRight["gid"]);
                        if(gidRight  && p.velocity.x >= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x - intersection.size.width, p.desiredPosition.y);
                            p.velocity = cc.PointMake(0.0, p.velocity.y);
                        }
 
                        var objBottom = tiles[0];
                        var gidBottom = parseInt(objBottom["gid"]);
                        if(gidBottom  && p.velocity.y <= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + intersection.size.height);
                            p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        }
                    } else if (tileIndx == 4) {
                        //tile is left above of player
                        var objLeft = tiles[4];
                        var gidLeft = parseInt(objLeft["gid"]);
                        if(gidLeft  && p.velocity.x <= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x + intersection.size.width, p.desiredPosition.y);
                            p.velocity = cc.PointMake(0.0, p.velocity.y);
                        }

                        var objAbove = tiles[1];
                        var gidAbove = parseInt(objAbove["gid"]);
                        if(gidAbove  && p.velocity.y >= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y - intersection.size.height);
                            p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        }
                    } else if (tileIndx == 5) {
                        //tile is right above of player
                        var objRight = tiles[3];
                        var gidRight = parseInt(objRight["gid"]);
                        if(gidRight  && p.velocity.x >= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x - intersection.size.width, p.desiredPosition.y);
                            p.velocity = cc.PointMake(0.0, p.velocity.y);
                        }

                        var objAbove = tiles[1];
                        var gidAbove = parseInt(objAbove["gid"]);
                        if(gidAbove  && p.velocity.y >= 0) {
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y - intersection.size.height);
                            p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        }
                    }
                }
            }  
        }
        p.setPosition(p.desiredPosition);
    },

    setViewpointCenter:function (position) {
        // if(gameOver) {
        //     return;
        // }
        var winSize = cc.Director.getInstance().getWinSize();
    
        var x = Math.max(position.x, winSize.width / 2);
        var y = Math.max(position.y, winSize.height / 2);
        x = Math.min(x, (this.map.getMapSize().width * this.map.getTileSize().width) - winSize.width / 2);
        y = Math.min(y, (this.map.getMapSize().height * this.map.getTileSize().height) - winSize.height/2);
        var actualPosition = cc.PointMake(x, y);
    
        var centerOfView = cc.PointMake(winSize.width/2, winSize.height/2);
        var viewPoint = cc.pSub(centerOfView, actualPosition);

        this.setPosition(viewPoint);
    },

    fire:function() {
    	if (this.hero.isBulletСharged) {
    		this.hero.isBulletСharged = false;
    		var b = this.hero.getChildByTag(500);
    		var p = cc.PointMake(this.hero.getPosition().x - 3, this.hero.getPosition().y - 28);
    		b.setPosition(p);
    		b.state = kShoot;
    		this.hero.removeChildByTag(500, true);
    		this.addChild(b, 1, 500);
    		this.bullet = b;

    		var shootPoint;
    		switch(this.hero.lastMoveType) {
    			case kMoveRight: {
    				shootPoint = cc.PointMake(2570, p.y);
    				break;
    			}
    			case kMoveLeft: {
    				shootPoint = cc.PointMake(-10, p.y);
    				break;
    			}
    		}

    		var d = cc.pDistance(p, shootPoint);
    		var time = d / 200;
    		b.runAction(cc.Sequence.create(cc.MoveTo.create(time, shootPoint), cc.CallFunc.create(this.createNewBullet, this)));
    		cc.AudioEngine.getInstance().playEffect(s_shoot);
    	}
    },

    createNewBullet:function() {
    	// this.bullet = null;
    	var b = this.getChildByTag(500);
    	b.setPosition(cc.p(100, 100));
    	b.state = kOnTheStage;
    },

});

GameLayer.create = function ()  {
    var sg = new GameScene();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);

        var hud = new HudLayer();
        hud.init();
        this.addChild(hud);
        layer.hud = hud;

    }
});
