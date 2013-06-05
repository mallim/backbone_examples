//
// This example is adopted from
// https://github.com/ddellacosta/backbone.js-examples/tree/master/collections3
//
define([
    'backbone',
    'backbone.marionette',
    '../app',
    'css!things/things'
],
function (Backbone, Marionette, app ) {

    "use strict";

    var Thing = Backbone.Model.extend({
        defaults: {
            text: 'This is the default text for this Thing.',
            href: 'thing'
        }
    });

    var ThingView = Marionette.ItemView.extend({

        id:'thing_view',

        // Take note that this particular line CANNOT WORK with Handlebars
        template: _.template("\
            <a class='task' href='<%= href %>'>\
            <%= text %></a>\
        ")
    });

    var ThingModule = app.module( "things" );

    ThingModule.addInitializer(function(){
        ThingModule.myThingView = new ThingView();
        app.nav.show( ThingModule.myThingView );
    });

    return ThingModule;

    var Controller = Marionette.Controller.extend({

        initialize: function(options){
            //console.log('controller init superbasic');
            this.myThingView = new ThingView();
            this.region = msgBus.reqres.request( "app:request:showRegion");
        },

        showThing: function(){
            this.myThingView.model = new Thing({text:'Press to reset 2', href:'#things/reset'});
            return this.region.show( this.myThingView );
        },

        resetThing: function(){
            this.myThingView.model = new Thing({text:'Press to index', href:'#things/index'});
            return this.region.show( this.myThingView );
        }
    });

    var Router = SubAppRouter.extend({
        appRoutes: {
            "index": "showThing",
            "reset":"resetThing"
        }
    });

    msgBus.events.on("app;start:route", function() {
        var options = {
            controller: new Controller()
        }
        //console.log( "things app;start:route");
        return new Router( "things", options );
    });
});
