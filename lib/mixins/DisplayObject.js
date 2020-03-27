"use strict";

var _utils = require("../animate/utils");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Mixins for the PIXI.DisplayObject class.
 * @memberof PIXI
 * @class DisplayObject
 */
var p = PIXI.DisplayObject.prototype;

// Color Matrix filter
var ColorMatrixFilter = void 0;
if (PIXI.filters) {
  ColorMatrixFilter = PIXI.filters.ColorMatrixFilter;
}

/**
 * Function to see if this is renderable or not. Useful for setting masks.
 * @method PIXI.DisplayObject#setRenderable
 * @param  {Boolean} [renderable=false] Make renderable
 * @return {PIXI.DisplayObject}
 */
/**
 * Shortcut to `setRenderable`.
 * @method PIXI.DisplayObject#re
 * @param  {Boolean} [renderable=false] Make renderable
 * @return {PIXI.DisplayObject}
 */
p.setRenderable = p.re = function (renderable) {
  this.renderable = !!renderable;
  return this;
};

/**
 * Shortcut for `setTransform`.
 * @method PIXI.DisplayObject#tr
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} scaleX The X Scale value
 * @param {Number} scaleY The Y Scale value
 * @param {Number} skewX The X skew value
 * @param {Number} skewY The Y skew value
 * @param {Number} pivotX The X pivot value
 * @param {Number} pivotY The Y pivot value
 * @return {PIXI.DisplayObject} Instance for chaining
 */
p.t = p.setTransform;

/**
 * Setter for mask to be able to chain.
 * @method PIXI.DisplayObject#setMask
 * @param {PIXI.Graphics} mask The mask shape to use
 * @return {PIXI.DisplayObject} Instance for chaining
 */
/**
 * Shortcut for `setMask`.
 * @method PIXI.DisplayObject#ma
 * @param {PIXI.Sprite|PIXI.Graphics} mask The mask shape to use
 * @return {PIXI.DisplayObject} Instance for chaining
 */
p.setMask = p.ma = function (mask) {
  // According to PIXI, only Graphics and Sprites can 
  // be used as mask, let's ignore everything else, like other
  // movieclips and displayobjects/containers
  if (mask) {
    if (!(mask instanceof PIXI.Graphics) && !(mask instanceof PIXI.Sprite)) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Warning: Masks can only be PIXI.Graphics or PIXI.Sprite objects.");
      }
      return this;
    }
  }
  this.mask = mask;
  return this;
};

/**
 * Setter for the alpha
 * @method PIXI.DisplayObject#setAlpha
 * @param {Number} alpha The alpha amount to use, from 0 to 1
 * @return {PIXI.DisplayObject} Instance for chaining
 */
/**
 * Shortcut for `setAlpha`.
 * @method PIXI.DisplayObject#a
 * @param {Number} alpha The alpha amount to use, from 0 to 1
 * @return {PIXI.DisplayObject} Instance for chaining
 */
p.setAlpha = p.a = function (alpha) {
  this.alpha = alpha;
  return this;
};

/**
 * Set the tint values by color.
 * @method PIXI.DisplayObject#setTint
 * @param {int} tint The color value to tint
 * @return {PIXI.DisplayObject} Object for chaining
 */
/**
 * Shortcut to `setTint`.
 * @method PIXI.DisplayObject#tn
 * @param {Number|String} tint The red percentage value
 * @return {PIXI.DisplayObject} Object for chaining
 */
p.setTint = p.i = function (tint) {
  if (typeof tint === "string") {
    tint = _utils2.default.hexToUint(tint);
  }
  // this.tint = tint
  // return this;
  // TODO: Replace with DisplayObject.tint setter
  // once the functionality is added to Pixi.js, for
  // now we'll use the slower ColorMatrixFilter to handle
  // the color transformation
  var r = tint >> 16 & 0xFF;
  var g = tint >> 8 & 0xFF;
  var b = tint & 0xFF;
  return this.c(r / 255, 0, g / 255, 0, b / 255, 0);
};

/**
 * Set additive and multiply color, tinting
 * @method PIXI.DisplayObject#setColorTransform
 * @param {Number} r The multiply red value
 * @param {Number} rA The additive red value
 * @param {Number} g The multiply green value
 * @param {Number} gA The additive green value
 * @param {Number} b The multiply blue value
 * @param {Number} bA The additive blue value
 * @return {PIXI.DisplayObject} Object for chaining
 */
/**
 * Shortcut to `setColor`.
 * @method PIXI.DisplayObject#c
 * @param {Number} r The multiply red value
 * @param {Number} rA The additive red value
 * @param {Number} g The multiply green value
 * @param {Number} gA The additive green value
 * @param {Number} b The multiply blue value
 * @param {Number} bA The additive blue value
 * @return {PIXI.DisplayObject} Object for chaining
 */
p.setColorTransform = p.c = function (r, rA, g, gA, b, bA) {
  var filter = this.colorTransformFilter;
  filter.matrix[0] = r;
  filter.matrix[4] = rA;
  filter.matrix[6] = g;
  filter.matrix[9] = gA;
  filter.matrix[12] = b;
  filter.matrix[14] = bA;
  this.filters = [filter];
  return this;
};

/**
 * The current default color transforming filters
 * @name {PIXI.filters.ColorMatrixFilter} PIXI.DisplayObject#colorTransformFilter
 */
if (!p.hasOwnProperty('colorTransformFilter')) {
  Object.defineProperty(p, 'colorTransformFilter', {
    set: function set(filter) {
      this._colorTransformFilter = filter;
    },
    get: function get() {
      return this._colorTransformFilter || new ColorMatrixFilter();
    }
  });
}

/**
 * Extend a container
 * @method PIXI.DisplayObject.extend
 * @static
 * @param {PIXI.DisplayObject} child The child function
 * @return {PIXI.DisplayObject} THe child
 */
/**
 * Extend a container (shortcut for `extend`)
 * @method PIXI.DisplayObject.e
 * @static
 * @param {PIXI.DisplayObject} child The child function
 * @return {PIXI.DisplayObject} THe child
 */
PIXI.DisplayObject.extend = PIXI.DisplayObject.e = function (child) {
  child.prototype = Object.create(p);
  child.prototype.__parent = p;
  child.prototype.constructor = child;
  return child;
};
//# sourceMappingURL=DisplayObject.js.map