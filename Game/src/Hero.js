var kStop = 0;
var kMoveRight = 1;
var kMoveLeft = 2;

var Hero = cc.Sprite.extend({
	velocity:0,
	desiredPosition:0,
	onGround:false,
	mightAsWellJump:null,
	moveType:null,
	_flyAnimation:null,
	_isAnimationStarted:null,

	ctor:function() {
		this._super();

		this.onGround = false;
    	this.mightAsWellJump = false;
    	this.velocity = cc.PointMake(0.0, 0.0);
		this._isAnimationStarted = false;
	},

	initPlayerAnimation:function (type) {
        var animFrames = [];
        // set frame
        var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame("duck_1.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("duck_2.png");
        var frame2 = cc.SpriteFrameCache.getInstance().getSpriteFrame("duck_3.png");
        var frame3 = cc.SpriteFrameCache.getInstance().getSpriteFrame("duck_4.png");       

        animFrames.push(frame0);
        animFrames.push(frame1);
        animFrames.push(frame2);
        animFrames.push(frame3);
        animFrames.push(frame2);
        animFrames.push(frame1);
        // animate
        this._flyAnimation = cc.Animation.create(animFrames, 0.1);

        this.playPayerAnimation();
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

	update:function(dt) {
    	var jumpForce = cc.PointMake(0.0, 310.0);
    	var jumpCutoff = 250.0;

    	if (this.mightAsWellJump && this.onGround) {
    		this.velocity = cc.pAdd(this.velocity, jumpForce);
    		//play audio effect
    	} else if (!this.mightAsWellJump && this.velocity.y > jumpCutoff) {
    		this.velocity = cc.PointMake(this.velocity.x, jumpCutoff);
    	}

    	var gravity = cc.PointMake(0.0, -450.0);
    	var gravityStep = cc.pMult(gravity, dt);

    	this.velocity = cc.PointMake(this.velocity.x * 0.90, this.velocity.y);

    	if (this.moveType == kMoveRight) {
            var forwardMove = cc.PointMake(800.0, 0.0);
            var forwardStep = cc.pMult(forwardMove, dt);
            this.velocity = cc.pAdd(this.velocity, forwardStep);
            this.setFlipX(false);
        } else if (this.moveType == kMoveLeft) {
            var forwardMove = cc.PointMake(-800.0, 0.0);
            var forwardStep = cc.pMult(forwardMove, dt);
            this.velocity = cc.pAdd(this.velocity, forwardStep);
            this.setFlipX(true);
        }

        var minMovement = cc.PointMake(-120.0, -450.0);
        var maxMovement = cc.PointMake(120.0, 560.0);
        this.velocity = cc.pClamp(this.velocity, minMovement, maxMovement);

    	this.velocity = cc.pAdd(this.velocity, gravityStep);
    	var stepVelocity = cc.pMult(this.velocity, dt);

    	this.desiredPosition = cc.pAdd(this.getPosition(), stepVelocity);
    },

    collisionBoundingBox:function () {
        var collisionBox = cc.rectInsetUp(this.getBoundingBox(), 0, 0);
        var diff = cc.pSub(this.desiredPosition, this.getPosition());
        var returnBoundingBox = cc.rectOffset(collisionBox, diff.x, diff.y);
        return returnBoundingBox;
    },

});