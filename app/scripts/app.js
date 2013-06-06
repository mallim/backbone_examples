
define([
    'backbone',
    'jquery',
    'libs/msgBus',
    'backbone.marionette',
    'handlebars',
],
function (Backbone, $, msgBus, Marionette ) {

    "use strict";

    // set up the app instance
    var app = new Marionette.Application();

    var currentModule;

    // initialize Marionette regions
    app.addRegions({
        nav:"#main_content"
        // content:"#main_content"
    });

    // contextual startup
    app.on("initialize:after", function(){
        app.router = new Router();
        //msgBus.events.trigger("app:main:show");
        // And hook up history tracking
        if (!Backbone.history.started) {
            return Backbone.history.start();
        }
    });

    //
    // Handles the event to stop previous module to release resources
    // Idea from https://gist.github.com/yethee/3729470
    //
    app.vent.on("module:start", function(module) {
        if (currentModule && currentModule !== module) {
            currentModule.stop();
        }
        currentModule = module;
    });

    // export the app from this module
    return app;
});
