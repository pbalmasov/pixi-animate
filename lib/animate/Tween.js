"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Provide timeline playback of movieclip
 * @memberof PIXI.animate
 * @class Tween
 * @constructor
 * @param {PIXI.animate.MovieClip} target The target to play
 * @param {Object} startProps The starting properties
 * @param {Object} endProps The ending properties
 * @param {int} startFrame frame number on which to begin tweening
 * @param {int} duration Number of frames to tween
 * @param {Function} [ease] Ease function to use
 */

var Tween = function () {
    function Tween(target, startProps, endProps, startFrame, duration, ease) {
        _classCallCheck(this, Tween);

        /**
         * target display object
         * @name PIXI.animate.Tween#target
         * @type {Object}
         */
        this.target = target;

        /**
         * properties at the start of the tween
         * @type {Object}
         * @name PIXI.animate.Tween#startProps
         */
        this.startProps = startProps;

        /**
         * properties at the end of the tween, as well as any properties that are set
         * instead of tweened
         * @type {Object}
         * @name PIXI.animate.Tween#endProps
         */
        this.endProps = {};

        /**
         * duration of tween in frames. For a keyframe with no tweening, the duration will be 0.
         * @type {int}
         * @name PIXI.animate.Tween#duration
         */
        this.duration = duration;

        /**
         * The frame that the tween starts on
         * @type {int}
         * @name PIXI.animate.Tween#startFrame
         */
        this.startFrame = startFrame;

        /**
         * the frame that the tween ends on
         * @type {int}
         * @name PIXI.animate.Tween#endFrame
         */
        this.endFrame = startFrame + duration;

        /**
         * easing function to use, if any
         * @type {Function}
         * @name PIXI.animate.Tween#ease
         */
        this.ease = ease;

        /**
         * If we don't tween.
         * @type {Boolean}
         * @name PIXI.animate.Tween#isTweenlessFrame
         */
        this.isTweenlessFrame = !endProps;

        var prop = void 0;
        if (endProps) {
            //make a copy to safely include any unchanged values from the start of the tween
            for (prop in endProps) {
                this.endProps[prop] = endProps[prop];
            }
        }

        //copy in any starting properties don't change
        for (prop in startProps) {
            if (!this.endProps.hasOwnProperty(prop)) {
                this.endProps[prop] = startProps[prop];
            }
        }
    }

    /**
     * Set the current frame.
     * @method PIXI.animate.Tween#setPosition
     * @param {int} currentFrame
     */


    Tween.prototype.setPosition = function setPosition(currentFrame) {
        //if this is a single frame with no tweening, or at the end of the tween, then
        //just speed up the process by setting values
        if (currentFrame >= this.endFrame) {
            this.setToEnd();
            return;
        }

        if (this.isTweenlessFrame) {
            this.setToEnd();
            return;
        }

        var time = (currentFrame - this.startFrame) / this.duration;
        if (this.ease) {
            time = this.ease(time);
        }
        var target = this.target;
        var startProps = this.startProps;
        var endProps = this.endProps;
        for (var _prop in endProps) {
            var lerp = props[_prop];
            if (lerp) {
                setPropFromShorthand(target, _prop, lerp(startProps[_prop], endProps[_prop], time));
            } else {
                setPropFromShorthand(target, _prop, startProps[_prop]);
            }
        }
    };

    /**
     * Set to the end position
     * @method PIXI.animate.Tween#setToEnd
     */


    Tween.prototype.setToEnd = function setToEnd() {
        var endProps = this.endProps;
        var target = this.target;
        for (var _prop2 in endProps) {
            setPropFromShorthand(target, _prop2, endProps[_prop2]);
        }
    };

    return Tween;
}();

//standard tweening


function lerpValue(start, end, t) {
    return start + (end - start) * t;
}

var props = {
    //position
    x: lerpValue,
    y: lerpValue,
    //scale
    sx: lerpValue,
    sy: lerpValue,
    //skew
    kx: lerpValue,
    ky: lerpValue,
    //rotation
    r: lerpRotation,
    //alpha
    a: lerpValue,
    //tinting
    // t: lerpColor,
    t: null,
    //values to be set
    v: null, //visible
    c: null, //colorTransform
    m: null, //mask
    g: null //not sure if we'll actually handle graphics this way?
};

//split r, g, b into separate values for tweening
/*function lerpColor(start, end, t)
{
    //split start color into components
    let sR = start >> 16 & 0xFF;
    let sG = start >> 8 & 0xFF;
    let sB = start & 0xFF;
    //split end color into components
    let eR = end >> 16 & 0xFF;
    let eG = end >> 8 & 0xFF;
    let eB = end & 0xFF;
    //lerp red
    let r = sR + (eR - sR) * percent;
    //clamp red to valid values
    if (r < 0)
        r = 0;
    else if (r > 255)
        r = 255;
    //lerp green
    let g = sG + (eG - sG) * percent;
    //clamp green to valid values
    if (g < 0)
        g = 0;
    else if (g > 255)
        g = 255;
    //lerp blue
    let b = sB + (eB - sB) * percent;
    //clamp blue to valid values
    if (b < 0)
        b = 0;
    else if (b > 255)
        b = 255;

    let combined = (r << 16) | (g << 8) | b;
    return combined;
}*/

var PI = Math.PI;
var TWO_PI = PI * 2;

//handle 355 -> 5 degrees only going through a 10 degree change instead of
//the long way around
//Math from http://stackoverflow.com/a/2708740
function lerpRotation(start, end, t) {
    var difference = Math.abs(end - start);
    if (difference > PI) {
        // We need to add on to one of the values.
        if (end > start) {
            // We'll add it on to start...
            start += TWO_PI;
        } else {
            // Add it on to end.
            end += PI + TWO_PI;
        }
    }

    // Interpolate it.
    var value = start + (end - start) * t;

    // wrap to 0-2PI
    /*if (value >= 0 && value <= TWO_PI)
        return value;
    return value % TWO_PI;*/

    //just return, as it's faster
    return value;
}

function setPropFromShorthand(target, prop, value) {
    switch (prop) {
        case "x":
            target.transform.position.x = value;
            break;
        case "y":
            target.transform.position.y = value;
            break;
        case "sx":
            target.transform.scale.x = value;
            break;
        case "sy":
            target.transform.scale.y = value;
            break;
        case "kx":
            target.transform.skew.x = value;
            break;
        case "ky":
            target.transform.skew.y = value;
            break;
        case "r":
            target.transform.rotation = value;
            break;
        case "a":
            target.alpha = value;
            break;
        case "t":
            target.i(value); // i = setTint
            break;
        case "c":
            target.c.apply(target, value); // c = setColorTransform
            break;
        case "v":
            target.visible = value;
            break;
        case "m":
            target.ma(value); // ma = setMask
            break;
    }
}

// Assign to namespace
exports.default = Tween;
//# sourceMappingURL=Tween.js.map