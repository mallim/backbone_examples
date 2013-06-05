//
// This example is originated from
// https://github.com/ddellacosta/backbone.js-examples/tree/master/super_basic1
//
// modified to show bootstrap modal dialog box
//
define([
    "../app",
    'jquery',
    'backbone',
    'backbone.marionette',
    'bootstrap-modal',
    'handlebars'
],
function ( app, $, Backbone, Marionette ) {

    "use strict";

    var SuperBasicModule = app.module( "superbasic" );

    var SuperBasicView = Marionette.ItemView.extend({
        template:Handlebars.compile("It's {{ simple }}")
    });

    var SuperBasicModel = Backbone.Model.extend({
        defaults:{
            simple:'Hello World'
        }
    });

    SuperBasicModule.addInitializer(function(){
        var theModel = new SuperBasicModel({simple: "This is powered by Backbone Bootstrap Modal!"} );
        var theView = new SuperBasicView( { model:theModel});
        var theDialogBoxOptions = {
            title:'Test Dialog Box',
            content:theView
        }
        var theDialogBox = new Backbone.BootstrapModal( theDialogBoxOptions  );
        theDialogBox.open();
        window.history.back();
    });

    return SuperBasicModule;
});

