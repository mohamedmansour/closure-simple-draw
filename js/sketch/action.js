// Copyright Mohamed Mansour 2010
//   http://mohamedmansour.com

goog.provide('sketch.Action');

/**
 * An abstract action that has built in Undo functionality.
 * @constructor
 * @param {string} name The name of the action.
 */
sketch.Action = function(name) {
  /**
   * @type {string}
   */
  this.name_ = name;
};

/**
 * Action executor.
 */
sketch.Action.prototype.execute = goog.abstractMethod;

/**
 * Action undoer.
 */
sketch.Action.prototype.undo = goog.abstractMethod;


/**
 * Action name
 * @return {string} The name of the action.
 */
sketch.Action.prototype.getName = function() {
  return this.name_;
};

