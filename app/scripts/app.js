
define([
    'backbone',
    'jquery',
    'libs/msgBus',
    'backbone.marionette',
    'handlebars',
],
function (Backbone, $, msgBus, Marionette ) {

    "use strict";

    //console.log("Staring MainApp")

    // set up the app instance
    var app = new Marionette.Application();

    // initialize Marionette regions
    app.addRegions({
        nav:"#tutorial_region",
        content:"#content"
    });

    app.addInitializer(function () {
        return msgBus.events.trigger( "initialize:before" );
    });

    // contextual startup
    app.on("initialize:after", function(){
        msgBus.events.trigger("app:main:show");
        // And hook up history tracking
        if (!Backbone.history.started) {
            return Backbone.history.start();
        }
    });

    app.on("start", function () {
        msgBus.commands.execute("initialize:ui");
    });

    /**
    msgBus.events.on("app:main:show", function(view) {
        return app.mainRegion.show(view);
    });
    **/

    msgBus.reqres.setHandler("app:request:showRegion", function() {
        return defaultLayout.content;
    });

    // export the app from this module
    return app;
});
