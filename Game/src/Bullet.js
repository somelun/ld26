var kCharged = 0;
var kShoot = 1;
var kOnTheStage = 2;

var Bullet = cc.Sprite.extend({
	state:0,

	ctor:function() {
		this._super();

	},

	collisionBoundingBox:function () {
        var collisionBox = cc.rectInsetUp(this.getBoundingBox(), 0, 0);
        var diff = cc.pSub(this.desiredPosition, this.getPosition());
        var returnBoundingBox = cc.rectOffset(collisionBox, diff.x, diff.y);
        return returnBoundingBox;
    },

});