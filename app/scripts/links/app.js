/**
 *
 *  This example is adopted from
 *  https://github.com/ddellacosta/backbone.js-examples/tree/master/localstorage5
 */
define([
    'backbone',
    'backbone.marionette',
    'libs/msgBus',
    'libs/Marionette.SubAppRouter',
    'hbs!links/link_view',
    'hbs!links/links_view',
    'localstorage',
    'less!links/links'
],
    function (Backbone, Marionette, msgBus, SubAppRouter, LinkViewTpl, LinksViewTpl ) {

        "use strict";

        var Link = Backbone.Model.extend({
        });

        var Links = Backbone.Collection.extend({
            model: Link,  // <-- this needs to be a function reference, not a string!
            localStorage: new Backbone.LocalStorage("Links")
        });

        var LinkView = Marionette.ItemView.extend({
            template:LinkViewTpl
        });

        var LinksView = Marionette.CompositeView.extend({

            template:LinksViewTpl,
            itemView:LinkView,
            itemViewContainer: "div#links",
            id:"links_view",

            initialize: function() {
                this.collection.fetch();
            },

            events: {
                "keypress input#link" : "save",
                "click button#delete" : "destroy"
            },

            destroy: function(e) {
                // Collection Manipulation...
                var modelID = $(e.currentTarget).attr("data-id");
                var link = this.collection.get(modelID);
                this.collection.localStorage.destroy(link);
                this.collection.remove(link);
            },

            // Stolen from official 'todos' example.
            save: function(e) {
                if (e.keyCode == 13) {
                    // Collection Manipulation...
                    var link = this.collection.create({
                        url:  $("input#link").val(),
                        desc: $("input#desc").val()
                    });

                    // Clean 'em out
                    $("input#desc").val('');
                    $("input#link").val('http://');

                    // Now reflect in the view.
                    this.collection.add( link );
                }
            },

            findModelID: function (classes) {
                return _.find(classes, function(className) { return className.match(/^c/); });
            }
        });

        var Controller = Marionette.Controller.extend({

            initialize: function(options){
                // console.log('controller init events');
            },

            load: function(){
                //console.log("loading cats");
                var view = new LinksView({ collection: new Links() })
                var region = msgBus.reqres.request( "app:request:showRegion");
                return region.show( view );
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
            console.log( "links app:start:route");
            return new Router( "links", options );
        });

    });

