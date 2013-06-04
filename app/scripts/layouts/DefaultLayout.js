    define([
        'backbone',
        'jquery',
        'libs/msgBus',
        'backbone.marionette',
        'css!../../styles/index'
    ],
    function (Backbone, $, msgBus, Marionette ) {

        var DefaultLayout = Marionette.Layout.extend({
            // template:"#default_layout",
            regions:{
                nav:"#navigation",
                content:"#content"
            }
        });

        // export the app from this module
        return DefaultLayout;
    });
