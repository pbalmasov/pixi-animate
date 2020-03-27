'use strict';

exports.__esModule = true;

var _ShapesCache = require('./ShapesCache');

var _ShapesCache2 = _interopRequireDefault(_ShapesCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The middleware for PIXI's ResourceLoader to be able to 
 * load Flash symbols such as graphics and images.
 * @memberof PIXI.animate
 * @class SymbolLoader
 * @private
 */
var SymbolLoader = {
    use: function use(resource, next) {
        var url = resource.url;
        var data = resource.data;

        if (!data) {
            next();
        } else if (url.search(/\.shapes\.(json|txt)$/i) > -1) {
            _ShapesCache2.default.add(resource.name, data);
        } else if (data.nodeName && data.nodeName === 'IMG') {
            // Add individual images to the texture cache by their
            // short symbol name, not the URL
            PIXI.Texture.addToCache(resource.texture, resource.name);
        }
        next();
    }
};

// Assign to the loader
PIXI.Loader.registerPlugin(SymbolLoader);

exports.default = SymbolLoader;
//# sourceMappingURL=SymbolLoader.js.map