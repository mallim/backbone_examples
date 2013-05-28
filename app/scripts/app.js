
define([
    'backbone',
    'jquery',
    'handlebars',
    'libs/msgBus',
    'backbone.marionette',
    'layouts/Default'
],
function (Backbone, $, Handlebars, msgBus, Marionette, DefaultLayout ) {

    "use strict";

    //console.log("Staring MainApp")

    // set up the app instance
    var app = new Marionette.Application();

    // initialize Marionette regions
    app.addRegions({
        mainRegion: "#main-layout"
    });

    var defaultLayout = new DefaultLayout();

    app.addInitializer(function () {
        return msgBus.events.trigger( "app;start:route" );
    });

    // contextual startup
    app.on("initialize:after", function(){
        msgBus.events.trigger("app:main:show", defaultLayout );
        // And hook up history tracking
        if (!Backbone.history.started) {
            return Backbone.history.start();
        }
    });

    app.on("start", function () {
        msgBus.commands.execute("initialize:ui");
    });

    msgBus.events.on("app:main:show", function(view) {
        return app.mainRegion.show(view);
    });

    msgBus.reqres.setHandler("app:request:showRegion", function() {
        return defaultLayout.content;
    });

    // export the app from this module
    return app;
});
