let Encore = require('@symfony/webpack-encore');
const {InjectManifest} = require('workbox-webpack-plugin');

Encore
// directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each 'page' of your app
     * (including one that's included on every page - e.g. 'app')
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if you JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')
    // .addEntry('page1', './assets/js/page1.js')

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(Encore.isProduction())
    // enables hashed filename (e.g. app.abc123.css)
    // .enableVersioning(Encore.isProduction())

    // enables Sass/SCSS support
    //.enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you're having problems with a jQuery plugin
    // .autoProvidejQuery()
    .addPlugin(new InjectManifest({
        include: [/\.css$/, /\.js$/],
        exclude: [/\.jpg$/, /\.png$/],
        swSrc: './assets/js/sw-handler.js',
        swDest: './../sw-handler.js',
        globPatterns: [
            '**/*.{js,png,html,css,ico}',
        ],
        globIgnores: ['**/not-cached'],
        dontCacheBustUrlsMatching: /\.\w{8}\./
    }))
;

module.exports = Encore.getWebpackConfig();
