//
// This example is adopted from
// http://weblog.bocoup.com/backbone-live-collections/
//
define([
    'backbone',
    'backbone.marionette',
    'libs/msgBus',
    'libs/Marionette.SubAppRouter',
    'libs/StreamCollection',
    'handlebars'
],
    function (Backbone, Marionette, msgBus, SubAppRouter, StreamCollection ) {

        "use strict";

        // Base Tweet Model.
        var Tweet = Backbone.Model.extend({});

        // Base representation of a tweet
        var TweetView = Marionette.ItemView.extend({
            tagName : "li",
            className : "tweet",
            template:Handlebars.compile("It's {{ text }}")
        });

        var Tweets = StreamCollection.extend({
            model : Tweet,
            initialize : function(models, options) {
                this.query = options.query;
            },
            url : function() {
                return "http://search.twitter.com/search.json?q=" + this.query + "&callback=?";
            },
            parse : function(data) {
                // note that the original result contains tweets inside of a 'results' array, not at
                // the root of the response.
                return data.results;
            },
            add : function(models, options) {
                var newModels = [];
                _.each(models, function(model) {
                    if (_.isUndefined(this.get(model.id))) {
                        newModels.push(model);
                    }
                }, this);
                return Backbone.Collection.prototype.add.call(this, newModels, options);
            }
        });

        var TweetsView = Marionette.CollectionView.extend({
            tagName : "ul",
            className : "tweets",
            itemView: TweetView
        });

        var Controller = Marionette.Controller.extend({

            initialize: function(options){
                // console.log('controller init events');
            },

            load: function(){
                var catTweets = new Tweets([], { query : "cats" });
                var catTweetsView = new TweetsView({ collection : catTweets });
                var region = msgBus.reqres.request( "app:request:showRegion");
                region.show( catTweetsView );
                catTweets.stream({
                    interval: 2000,
                    add: true
                });
                return region;
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
            console.log( "tweets app:start:route");
            return new Router( "tweets", options );
        });

    });
