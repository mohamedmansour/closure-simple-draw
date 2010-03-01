// Copyright Mohamed Mansour 2010
//   http://mohamedmansour.com

goog.provide('sketch.HistoryStack');

goog.require('goog.array');

/**
 * History stack to keep track of Undo and Redo.
 * @constructor
 */
sketch.HistoryStack = function() {
  /**
   * The list of actions stored in history.
   * @type {Array.<sketch.Action>}
   */
  this.actions_ = [];
  
  /**
   * The current head pointer to the stack.
   * @type {number}
   */
  this.next_ = 0;
  
  /**
   * The listener if needed to observe for history changes.
   * @type {function(Object)}
   */
  this.listener_ = null;
};


/**
 * Add a new action to the history stack.
 * @param {sketch.Action} action The action to add to history.
 */
sketch.HistoryStack.prototype.add = function(action) {
  action.execute();
  if (this.canRedo())
    goog.array.splice(this.actions_,
                      this.next_,
                      this.getSize() - this.next_);
  this.actions_.push(action);
  this.next_ = this.getSize();
  this.fireListener('add', this.next_, action);
};


/**
 * Undo to the last change from the history stack.
 */
sketch.HistoryStack.prototype.undo = function() {
  if (this.canUndo()) {
    var action = this.actions_[--this.next_];
    action.undo();
    this.fireListener('undo', this.next_, action);
  }
};


/**
 * Redo the next change from the history stack.
 */
sketch.HistoryStack.prototype.redo = function() {
  if (this.canRedo()) {
    var action = this.actions_[this.next_++];
    action.execute();
    this.fireListener('redo', this.next_ - 1, action);
  }
};


/**
 * Clear the history stack. No longer can undo, redo.
 */
sketch.HistoryStack.prototype.clear = function() {
  var length = this.getSize();
  goog.array.clear(this.actions_);
  this.next_ = 0;
  this.fireListener('clear', length);
};


/**
 * Returns whether there are any redo's anymore.
 * @return {boolean} the state.
 */
sketch.HistoryStack.prototype.canRedo = function() {
  return this.next_ < this.getSize();
};


/**
 * Returns whether there are any undo's anymore.
 * @return {boolean} the state.
 */
sketch.HistoryStack.prototype.canUndo = function() {
  return this.next_ > 0;
}


/**
 * Returns the total stack size.
 * @return {number} the number of history actions.
 */
sketch.HistoryStack.prototype.getSize = function() {
  return this.actions_.length;
};


/**
 * Add a listener to observe all actions done from the history stack.
 * @param {function(Object)} listener The listener to set for history changes.
 */
sketch.HistoryStack.prototype.setListener = function(listener) {
  this.listener_ = listener;
};


/**
 * Fire a history change event to the person listening.
 * @param {string} method The method that is fired.
 * @param {number} index The index that the Action is being fired from.
 * @param {sketch.Action} item The action that the listener is handling.
 */
sketch.HistoryStack.prototype.fireListener = function(method, index, item) {
  if (this.listener_) {
    this.listener_.call(this, {method: method, index: index, item: item});
  }
};