// Copyright Mohamed Mansour 2010
//   http://mohamedmansour.com

goog.provide('sketch.DrawAction');

goog.require('goog.graphics');

goog.require('sketch.Action');

/**
 * Temp draw action.
 * @param {goog.graphics.AbstractGraphics} graphics
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 * @constructor
 * @extends sketch.Action
 */
sketch.DrawAction = function(graphics, x, y) {
  sketch.Action.call(this, "Drawing on [" + x + "," + y + "]");
  this.graphics_ = graphics;
  this.id_ = null;
  this.x_ = x;
  this.y_ = y;
  this.color_ = this.getRandomColor();
  this.size_ = this.getRandomSize();
};
goog.inherits(sketch.DrawAction, sketch.Action);

/**
 * Execute drawing a circle action.
 * @override
 */
sketch.DrawAction.prototype.execute = function() {
  var fill = new goog.graphics.SolidFill(this.color_);
  var stroke = new goog.graphics.Stroke(1, this.color_);
  this.id_ = this.graphics_.drawCircle(this.x_, this.y_, this.size_,
                                        stroke, fill);
};

/**
 * Execute removing the circle action.
 * @override
 */
sketch.DrawAction.prototype.undo = function() {
  this.graphics_.removeElement(this.id_);
};


/**
 * Return a random size between 10 to 100.
 * @return {number} random number.
 */
sketch.DrawAction.prototype.getRandomSize = function () {
  return Math.random() * 100 + 10;
}


/**
 * Return a random rgb color.
 * @return {string} colour as an rgb string.
 */
sketch.DrawAction.prototype.getRandomColor = function () {
  var r = Math.round(0xffffff * Math.random());
  return 'rgb(' + (r >> 16) + ',' + (r >> 8 & 255) + ',' + (r & 255) + ')';
};
