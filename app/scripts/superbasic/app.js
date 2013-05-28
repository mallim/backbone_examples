//
// This example is adopted from
// https://github.com/ddellacosta/backbone.js-examples/tree/master/super_basic1
//
define([
    'backbone',
    'backbone.marionette',
    'libs/msgBus',
    'libs/Marionette.SubAppRouter',
    'handlebars'
],
function (Backbone, Marionette, msgBus, SubAppRouter ) {

    // Advanced version ...
    // var modelSuperBasic = msgBus.reqres.request("superbasic:i_want_my_model");

    "use strict";

    var SuperBasicView = Marionette.ItemView.extend({
        template:Handlebars.compile("It's {{ simple }}")
    });

    var SuperBasicModel = Backbone.Model.extend({
        defaults:{
            simple:'Hello World'
        }
    });

    var Controller = Marionette.Controller.extend({

        initialize: function(options){
            //console.log('controller init superbasic');
        },

        load: function(){
            var theModel = new SuperBasicModel({simple: "okay, I've figured out the super-basics.  Woohoo!"} );
            var theView = new SuperBasicView( { model:theModel});
            var region = msgBus.reqres.request( "app:request:showRegion");
            return region.show( theView );
        }
    });

    var Router = SubAppRouter.extend({
        appRoutes: {
            "index": "load"
        }
    });

    msgBus.events.on("app;start:route", function() {
        var options = {
            controller: new Controller()
        }
        console.log( "superbasic app;start:route");
        return new Router( "superbasic", options );
    });
});

