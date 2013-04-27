
var GameLayer = cc.Layer.extend({
    isMouseDown:false,
    map:null,
    walls:null,
    hero:null,
    sky:null,
    baloons:null,
    b:null,

    init:function () {

        this._super();

		var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_objects_plist);

		var sky = cc.LayerColor.create(cc.c4(49, 162, 238, 255), 2560, 640);
        this.addChild(sky, -1);

        this.map = cc.TMXTiledMap.create(s_map_plist);
        this.addChild(this.map, 0, 123);

        this.walls = this.map.getLayer("walls");

        this.hero = new Hero();
        this.hero.initWithSpriteFrameName("duck_1.png");
        this.hero.setPosition(cc.p(130, 400));
        this.addChild(this.hero, 1);
        this.hero.initPlayerAnimation();

        this.b = new Baloon();
        this.b.initWithSpriteFrameName("baloon_1.png");
        this.b.setPosition(cc.p(130, 400));
        this.addChild(this.b, 1);
        this.b.initPlayerAnimation();

        this.setKeyboardEnabled(true);

		this.schedule(this.update);

        return true;
    },

    update:function(dt) {
        this.hero.update(dt);
        this.checkForAndResolveCollisions(this.hero);
        this.setViewpointCenter(this.hero.getPosition());

        if (!this.b._isMoveActivated) {
        	this.b.runBezier();
        }
    },

    //keys
    onKeyDown:function (keyCode) {
        switch(keyCode) {
            case cc.KEY.right: {
                this.hero.moveType = kMoveRight;
                break;
            }
            case cc.KEY.left: {
                this.hero.moveType = kMoveLeft;
                break;
            }
            case cc.KEY.space: {
                this.hero.mightAsWellJump = true;
                break;
            }
            case cc.KEY.x: {
                //fire?
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
                //fire?
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

                    if (tileIndx == 0) {
                        //tile is directly below player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + intersection.size.height);
                        p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        p.onGround = true;
                    } else if (tileIndx == 1) {
                        //tile is directly above player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y - intersection.size.height);
                        p.velocity = cc.PointMake(p.velocity.x, 0.0);
                    } else if (tileIndx == 2) {
                        //tile is left of player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x + intersection.size.width, p.desiredPosition.y);
                    } else if (tileIndx == 3) {
                        //tile is right of player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x - intersection.size.width, p.desiredPosition.y);
                    } else {
                        if (intersection.size.width > intersection.size.height) {
                            //tile is diagonal, but resolving collision vertially
                            p.velocity = cc.PointMake(p.velocity.x, 0.0);
                            var resolutionHeight;
                            if (tileIndx > 5) {
                                resolutionHeight = -intersection.size.height;
                                p.onGround = true;
                            } else {
                                resolutionHeight = intersection.size.height;
                            }                        
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + resolutionHeight);
                        } else {
                            var resolutionWidth;
                            if (tileIndx == 6 || tileIndx == 4) {
                                resolutionWidth = intersection.size.width;
                            } else {
                                resolutionWidth = -intersection.size.width;
                            }
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x + resolutionWidth , p.desiredPosition.y);
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

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);

    }
});
