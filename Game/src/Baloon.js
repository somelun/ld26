
var Baloon = cc.Sprite.extend({
	_flyAnimation:null,
    _booomAnimation:null,
	_isAnimationStarted:null,
    _isMoveActivated:false,

	ctor:function() {
		this._super();

		this._isAnimationStarted = false;
	},

	initPlayerAnimation:function (type) {
        var animFrames = [];
        // set frame
        var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame("baloon_1.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("baloon_2.png");
        var frame2 = cc.SpriteFrameCache.getInstance().getSpriteFrame("baloon_3.png");
        var frame3 = cc.SpriteFrameCache.getInstance().getSpriteFrame("baloon_4.png");       

        animFrames.push(frame0);
        animFrames.push(frame1);
        animFrames.push(frame2);
        animFrames.push(frame3);

        // animate
        this._flyAnimation = cc.Animation.create(animFrames, 0.1);


        var animFrames2 = [];
        var frame4 = cc.SpriteFrameCache.getInstance().getSpriteFrame("bexpl_1.png");
        var frame5 = cc.SpriteFrameCache.getInstance().getSpriteFrame("bexpl_2.png");
        var frame6 = cc.SpriteFrameCache.getInstance().getSpriteFrame("bexpl_3.png");
        var frame7 = cc.SpriteFrameCache.getInstance().getSpriteFrame("bexpl_4.png");       

        animFrames2.push(frame4);
        animFrames2.push(frame5);
        animFrames2.push(frame6);
        animFrames2.push(frame7);

        this._booomAnimation = cc.Animation.create(animFrames2, 0.1);

        this.playPayerAnimation();
        // this.runBezier();
    },

    playBoomAnimation:function() {
        if(this._isAnimationStarted == false) {
            this._isAnimationStarted = true;
            var animate = cc.Animate.create(this._booomAnimation);
            this.runAction(animate);
        }
    },

    playPayerAnimation:function () {
        if(this._isAnimationStarted == false) {
            this._isAnimationStarted = true;
            var animate = cc.Animate.create(this._flyAnimation);
            this.runAction(cc.RepeatForever.create(animate));
        }
    },

    stopPlayerAnimation:function () {
        if(this._isAnimationStarted == true) {
            this.stopAllActions();
            this._isAnimationStarted = false;
        }
    },

    runBezier:function() {
        this._isMoveActivated = true;
        this.runAction(cc.Sequence.create(this.bezier(), cc.CallFunc.create(this.resetMoveActivated, this)));
    },

    resetMoveActivated:function() {
        this._isMoveActivated = false;
    },

    bezier:function () {
        var p = this.getPosition();
        var bezier = [p, this.randomPoint(), this.randomPoint()];
        var bezierTo = cc.BezierTo.create(4, bezier);

        return bezierTo;
    },

    randomPoint:function () {
        var x = Math.random() * 2560;
        var y = Math.random() * 640;
        return cc.PointMake(x, y);
    },

    collisionBoundingBox:function () {
        var collisionBox = cc.rectInsetUp(this.getBoundingBox(), 0, 0);
        var diff = cc.pSub(this.desiredPosition, this.getPosition());
        var returnBoundingBox = cc.rectOffset(collisionBox, diff.x, diff.y);
        return returnBoundingBox;
    },

});