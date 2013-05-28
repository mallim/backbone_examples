    define([
        'backbone',
        'jquery',
        'handlebars',
        'libs/msgBus',
        'backbone.marionette',
        'css!../../styles/index'
    ],
    function (Backbone, $, Handlebars, msgBus, Marionette ) {

        var DefaultLayout = Marionette.Layout.extend({
            template:"#default_layout",
            regions:{
                content:"#content"
            }
        });

        // export the app from this module
        return DefaultLayout;
    });
