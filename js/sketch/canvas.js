goog.provide('sketch.Widget');

goog.require('goog.dom');
goog.require('goog.graphics');
goog.require('goog.ui.Component');

goog.require('sketch.HistoryStack');
goog.require('sketch.DrawAction');

/**
 * Some testing Canvas used to test the history stack.
 * @param {number} width The width of the canvas.
 * @param {number} height The height of the canvas.
 * @constructor
 * @extends goog.ui.Component
 */
sketch.Canvas = function(width, height) {
  goog.ui.Component.call(this);
  this.historyStack_ = new sketch.HistoryStack();
  this.graphics_ = new goog.graphics.createGraphics(width, height);
};
goog.inherits(sketch.Canvas, goog.ui.Component);


/** @inheritDoc */
sketch.Canvas.prototype.decorateInternal = function(element) {
  sketch.Canvas.superClass_.decorateInternal.call(this, element);
  // Draw the graphics context.
  this.graphics_.render(this.getElement());
};


/** @inheritDoc */
sketch.Canvas.prototype.enterDocument = function() {
  sketch.Canvas.superClass_.enterDocument.call(this);
  goog.events.listen(this.getElement(), goog.events.EventType.MOUSEUP,
                     this.onMouseClick_, false, this);
  this.historyStack_.setListener(goog.bind(this.onHistoryChange_, this));
};


/**
 * Setup the Draw Action which draws a circle on the canvas. That action
 * will be recorded in the history stack.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 */
sketch.Canvas.prototype.drawCircle = function(x, y) {
  this.historyStack_.add(new sketch.DrawAction(this.graphics_, x, y));
};


/**
 * Inform the history stack to undo to the last change.
 */
sketch.Canvas.prototype.undo = function() {
  this.historyStack_.undo();
};


/**
 * Inform the history stack to redo to the next change.
 */
sketch.Canvas.prototype.redo = function() {
  this.historyStack_.redo();
};


/**
 * Clears the canvas. (which clears the history as well)
 */
sketch.Canvas.prototype.clear = function() {
  this.graphics_.clear();
  this.historyStack_.clear();
};

/**
 * Mouse click on the canvas which drawas the circle.
 */
sketch.Canvas.prototype.onMouseClick_ = function(e) {
  this.drawCircle(e.clientX - this.getElement().offsetLeft,
                  e.clientY - this.getElement().offsetTop);
};


/**
 * Log utility to show how the history stack works.
 * @param {Object} e History object containing {method, index, item}
 */
sketch.Canvas.prototype.onHistoryChange_ = function(e) {
  var history = goog.dom.$('history');
  if (e.method != 'clear')
    var msg = e.method + ' - [index: ' + e.index + '] [stack size: ' + this.historyStack_.getSize() + '] [location: ' + e.item.x_ + ',' + e.item.y_ +']';
  else
    var msg = 'clear - ' + e.index + ' items';
  var log = goog.dom.createDom('p', null, msg);
  goog.dom.appendChild(history, log);
  history.scrollTop = history.scrollHeight;
};