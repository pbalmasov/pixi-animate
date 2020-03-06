import {Loader, Container} from 'pixi.js';

export interface StageRef {
    new ():Container;
    /**
     * Assets used to preload
     */
    assets:any;
}
type Complete = (instance:Container, loader:Loader) => void;
interface LoadOptions {
    /**
     * Reference to the stage class
     */
    stage:StageRef;
    /**
     * The Container to auto-add the stage to.
     */
    parent?:Container;
    /**
     * Callback for load completion.
     */
    complete?:Complete;
    /**
     * Base root directory
     */
    basePath?:string;
    /**
     * enable or disable automatic instantiation of stage
     */
    createInstance?:boolean;
}
/**
 * Load the stage class and preload any assets
 * ```
 * let basePath = "file:/path/to/assets";
 * let renderer = new PIXI.autoDetectRenderer(1280, 720);
 *
 * let extensions = PIXI.compressedTextures.detectExtensions(renderer);
 * let loader = new PIXI.loaders.Loader();
 * // this is an example of setting up a pre loader plugin to handle compressed textures in this case
 * loader.pre(PIXI.compressedTextures.extensionChooser(extensions));
 *
 * // specify metadata this way if you want to provide a default loading strategy for all assets listed in the PIXI animation
 * let metadata = { default: { metadata: { imageMetadata: { choice: [".crn"] } } } };
 * // specify metadata this way if you want to provide a specific loading strategy for a certain asset listed inside the PIXI animation library
 * let metadata = { MyStage_atlas_1: { metadata: { imageMetadata: { choice: [".crn"] } } } };
 *
 * let stage = new PIXI.Container();
 * PIXI.animate.load(lib.MyStage, stage, ()=>{}, basePath, loader, metadata);
 * function update() {
 *      renderer.render(stage);
 *      update();
 * }
 * update();
 * ```
 * @param StageRef Reference to the stage class.
 * @param parent The Container to auto-add the stage to.
 * @param complete The callback function when complete.
 * @param basePath Base root directory
 * @param loader A Pixi loader object
 * @param metadata A metadata object for the asset being loaded
 * @return instance of PIXI resource loader
 */
export function load(stage:StageRef, parent:Container, complete?:Complete, basePath?:string, loader?:Loader, metadata?:any):Loader;
/**
 * Load the stage class and preload any assets
 * ```
 * let renderer = new PIXI.autoDetectRenderer(1280, 720);
 * let stage = new PIXI.Container();
 * PIXI.animate.load(lib.MyStage, stage);
 * function update() {
 *      renderer.render(stage);
 *      update();
 * }
 * update();
 * ```
 * @param StageRef Reference to the stage class.
 * @param parent The Container to auto-add the stage to.
 * @param basePath Base root directory
 * @return instance of PIXI resource loader
 */
export function load(stage:StageRef, parent:Container, basePath?:string):Loader;
/**
 * Load the stage class and preload any assets
 * ```
 * let renderer = new PIXI.autoDetectRenderer(1280, 720);
 * let stage = new PIXI.Container();
 * PIXI.animate.load(lib.MyStage, function(instance){
 *     stage.addChild(instance);
 * });
 * function update() {
 *      renderer.render(stage);
 *      update();
 * }
 * update();
 * ```
 * @param StageRef Reference to the stage class.
 * @param complete The callback function when complete.
 * @return instance of PIXI resource loader
 */
export function load(stage:StageRef, complete:Complete, basePath?:string):Loader;
/**
 * Load the stage class and preload any assets
 * @param options Options for loading.
 * @return instance of PIXI resource loader
 */
export function load(options:LoadOptions):Loader;
export function load(optionsOrStage:LoadOptions|StageRef, parentOrComplete?:Complete|Container, completeOrPath?:Complete|string, basePath?:string, loader?:Loader, metadata?:any):Loader {
    let complete:Complete;
    let parent:Container;
    // Support arguments (ref, complete, basePath)
    if (typeof parentOrComplete === "function") {
        basePath = completeOrPath as string;
        complete = parentOrComplete;
        parentOrComplete = null;
    } else {
        parent = parentOrComplete;
        if (typeof completeOrPath === "string") {
            basePath = completeOrPath;
            completeOrPath = null;
            complete = null;
        }
        else {
            complete = completeOrPath;
        }
    }

    if (typeof optionsOrStage === "function") {
        optionsOrStage = {
            stage: optionsOrStage,
            parent: parent,
            basePath: basePath || "",
            complete
        };
    }

    const options:LoadOptions = Object.assign({
        stage: null,
        parent: null,
        basePath: '',
        complete: null,
        createInstance: true
    }, optionsOrStage || {});

    loader = loader || new Loader();

    function done() {
        let instance = (options.createInstance && typeof options.stage === "function") ? new options.stage() : null;
        if (options.parent) {
            options.parent.addChild(instance);
        }
        if (options.complete) {
            options.complete(instance, loader);
        }
    }

    // Check for assets to preload
    let assets = options.stage.assets || {};
    if (assets && Object.keys(assets).length) {
        // assetBaseDir can accept either with trailing slash or not
        let basePath = options.basePath;
        if (basePath) {
            basePath += "/";
        }
        for (let id in assets) {
            var data = null;
            if(metadata) {
                // if the metadata was supplied for this particular asset, use these options
                if(metadata[id]) {
                    data = metadata[id];
                }
                // if the metadata supplied a default option
                else if (metadata.default){
                    data = metadata.default;
                }
            }
            loader.add(id, basePath + assets[id], data);
        }
        loader.once('complete', done).load();
    } else {
        // tiny case where there's only text and no shapes/animations
        done();
    }

    return loader;
};
