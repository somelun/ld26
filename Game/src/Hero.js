var kStop = 0;
var kMoveRight = 1;
var kMoveLeft = 2;

var Hero = cc.Sprite.extend({
	velocity:0,

	ctor:function() {
		this._super();
	},

	update:function() {
		//
	},

	collisionBoundingBox:function () {
        var collisionBox = cc.rectInsetUp(this.getBoundingBox(), 0, 0);
        var diff = cc.pSub(this.desiredPosition, this.getPosition());
        var returnBoundingBox = cc.rectOffset(collisionBox, diff.x, diff.y);
        return returnBoundingBox;
    },

});