"use strict";

/**
 * Mixins for the PIXI.Text class.
 * @memberof PIXI
 * @class Text
 */
var p = PIXI.Text.prototype;

// Possible align values
var ALIGN_VALUES = ["center", "right"];

/**
 * Setter for the alignment, also sets the anchor point
 * to make sure the positioning is correct.
 * @method PIXI.Text#setAlign
 * @param {String} align Either, center, right, left
 * @return {PIXI.Text} For chaining
 */
/**
 * Shortcut for `setAlign`.
 * @method PIXI.Text#g
 * @param {String|int} align Either, center (0), right (1), left (-1)
 * @return {PIXI.Text} For chaining
 */
p.setAlign = p.g = function (align) {
    if (typeof align == "string") {
        align = ALIGN_VALUES.indexOf(align);
    }
    this.style.align = ALIGN_VALUES[align] || "left";
    this.anchor.x = (align + 1) / 2;
    return this;
};

// Map of short names to long names
var STYLE_PROPS = {
    o: 'font', // TODO: deprecate in Pixi v4
    z: 'fontSize',
    f: 'fontFamily',
    y: 'fontStyle',
    g: 'fontWeight',
    i: 'fill',
    a: 'align',
    s: 'stroke',
    t: 'strokeThickness',
    w: 'wordWrap',
    d: 'wordWrapWidth',
    l: 'lineHeight',
    h: 'dropShadow',
    c: 'dropShadowColor',
    n: 'dropShadowAngle',
    b: 'dropShadowBlur',
    p: 'padding',
    x: 'textBaseline',
    j: 'lineJoin',
    m: 'miterLimit',
    e: 'letterSpacing'
};

/**
 * Set the style, a chainable version of style setter
 * @method PIXI.Text#setStyle
 * @param {Object} style
 * @return {PIXI.Text} instance of text field
 */
/**
 * Shortcut for `setStyle`.
 * @method PIXI.Text#ss
 * @param {Object} style
 * @return {PIXI.Text} instance of text field
 */
p.setStyle = p.ss = function (style) {
    // Replace short STYLE_PROPS with long names
    for (var k in STYLE_PROPS) {
        if (style[k] !== undefined) {
            style[STYLE_PROPS[k]] = style[k];
            delete style[k];
        }
    }
    this.style = style;
    return this;
};

/**
 * Initial setting of the drop shadow.
 * @method PIXI.Text#setShadow
 * @param {String} [color="#000000"] The color to set
 * @param {Number} [angle=Math.PI/4] The angle of offset, in radians
 * @param {Number} [distance=5] The offset distance
 * @return {PIXI.Text} For chaining
 */
/**
 * Shortcut for `setShadow`.
 * @method PIXI.Text#sh
 * @param {String} [color="#000000"] The color to set
 * @param {Number} [angle=Math.PI/4] The angle of offset, in radians
 * @param {Number} [distance=5] The offset distance
 * @return {PIXI.Text} For chaining
 */
p.setShadow = p.sh = function (color, angle, distance) {
    var style = this.style;
    style.dropShadow = true;

    // Convert color to hex string
    if (color !== undefined) {
        color = "#" + color.toString(16);
    }
    style.dropShadowColor = isUndefinedOr(color, style.dropShadowColor);
    style.dropShadowAngle = isUndefinedOr(angle, style.dropShadowAngle);
    style.dropShadowDistance = isUndefinedOr(distance, style.dropShadowDistance);
    return this;
};

/**
 * Check if a value is undefined, fallback to default value
 * @method isUndefinedOr
 * @private
 * @param {*} value The value to check
 * @param {*} defaultValue The default value if value is undefined
 * @return {*} The either the value or the default value
 */
var isUndefinedOr = function isUndefinedOr(value, defaultValue) {
    return value === undefined ? defaultValue : value;
};
//# sourceMappingURL=Text.js.map