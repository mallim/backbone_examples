//
// This example is adopted from
// https://github.com/ddellacosta/backbone.js-examples/tree/master/events2
//
define([
    'backbone',
    'backbone.marionette',
    'libs/msgBus',
    'libs/Marionette.SubAppRouter',
    'hbs!count/count-view',
    'backbone.stickit'
],
function (Backbone, Marionette, msgBus, SubAppRouter, CountViewTpl ) {

    "use strict";

    var Counter = Backbone.Model.extend({
        defaults: {
            count: 0
        },

        increment: function() { this.set('count', this.get('count')+1) },
        decrement: function() { this.set('count', this.get('count')-1) }
    });

    // The View (and effectively Controller) which wraps up our Counter for the DOM
    var CounterView = Marionette.ItemView.extend({

        template: CountViewTpl,

        // This connects events on DOM elements (WITHIN THE VIEW--IMPORTANT!)
        // to methods specified in this View.
        events: {
            "click #increment_button": 'increment',
            "click #decrement_button": 'decrement'
        },

        // Adopting backbone.stickit's way of binding to UI element
        bindings: {
            '#count': 'count'
        },

        /**
        // This is marionette's way of binding to model
        modelEvents: {
            "change": "render"
        },
        **/

        // It would be nice if you could just pass model methods to the backbone events hash...
        increment: function() {
            this.model.increment()
        },

        decrement: function() {
            this.model.decrement()
        },

        onRender: function(){
            // manipulate the `el` here. it's already
            // been rendered, and is full of the view's
            // HTML, ready to go.
            this.stickit();
        }
    });

    var Controller = Marionette.Controller.extend({

        initialize: function(options){
            //console.log('controller init events');
        },

        load: function(){
            //console.log("loading counters");
            var myCounter = new Counter();
            var myCounterView = new CounterView({ model: myCounter});
            var region = msgBus.reqres.request( "app:request:showRegion");
            return region.show( myCounterView );
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
        console.log( "counts app:start:route");
        return new Router( "events", options );
    });
});
