//
// This example is adopted from
// https://github.com/ddellacosta/backbone.js-examples/tree/master/collections3
//
define([
    'backbone',
    'backbone.marionette',
    'libs/msgBus',
    'libs/Marionette.SubAppRouter',
    'hbs!cats/angry_cats_view',
    'hbs!cats/angry_cat_view',
    'less!cats/collections3'
],
    function (Backbone, Marionette, msgBus, SubAppRouter, AngryCatsViewTpl, AngryCatViewTpl ) {

        "use strict";

        var AngryCat = Backbone.Model.extend({
            defaults: {
                id:0,
                rank: 0,
                move: ''
            },

            rank_up: function() { this.set('move', 'up') },
            rank_down: function() { this.set('move', 'down') }
        });

        var AngryCats = Backbone.Collection.extend({
            model: AngryCat,

            initialize: function(cats) {
                _.each(cats, function(cat) {
                    // This is the *same* line of code as is in set_rank. How do I call that here?
                    cat.set('rank', _.max(cats, function(cat) { return cat.get('rank') }).get('rank') + 1);
                });

                // If we are added via the 'add' method:
                this.on('add', this.set_rank);
                this.sort();
            },

            comparator: function(cat) {
                return cat.get('rank');
            },

            trade_rank: function(move_cat, direction) {
                var old_rank = move_cat.get('rank');
                var new_rank = '';
                (direction == 'up') ? new_rank = old_rank - 1 : new_rank = old_rank + 1;
                var push_cat = _.find(this.models, function(cat) { return cat.get('rank') == new_rank });

                if (new_rank < 1 || new_rank > this.models.length) {
                    return;
                }

                move_cat.set('rank', new_rank);
                push_cat.set('rank', old_rank);
                this.sort();
            },

            set_rank: function(cat) {
                cat.set('rank', _.max(this.models, function(cat) { return cat.get('rank') }).get('rank') + 1);
            }
        });

        var AngryCatView = Marionette.ItemView.extend({

            // This is responsible for automatically updating the UI
            // in response to changes in the model
            //initialize: function() {
                //this.model.on('change', this.render, this);
            //},

            tagName: 'tr',
            className: 'angry_cat',
            template:AngryCatViewTpl,
        });

        var AngryCatsView = Marionette.CompositeView.extend({

            //el: $("div#contents"),
            tagName:'table',
            className:'table-striped table-bordered',
            template:AngryCatsViewTpl,
            itemView: AngryCatView,
            itemViewContainer: "tbody",
            id:'angry_cats',

            events: {
                'click img.rank_up': 'rank_up',
                'click img.rank_down': 'rank_down'
            },

            debug: function(event) {
                console.log( "Yes, I am being called when collection is reset");
            },

            rank_up: function(event) {
                this.collection.trade_rank(this.find_move_cat(event, 'up'), 'up');
                this.render();
            },

            rank_down: function(event) {
                this.collection.trade_rank(this.find_move_cat(event, 'down'), 'down');
                this.render();
            },

            find_move_cat: function(event, direction) {
                var classes = $(event.currentTarget).attr('class').split(' ');
                var cid = _.find(classes, function(c) { return c != ('rank_' + direction) });
                return this.collection.find(function(cat) { return cat.id == cid });
            },

            onBeforeRender: function(){
                // set up final bits just before rendering the view's `el`
                this.collection.sort();
            }
        });

        var Controller = Marionette.Controller.extend({

            initialize: function(options){
                // console.log('controller init events');
            },

            load: function(){
                //console.log("loading cats");
                var cats = new AngryCats([
                    new AngryCat({ id:1, name: 'Wet Cat', image_path: 'images/cat2.jpg' }),
                    new AngryCat({ id:2, name: 'Bitey Cat', image_path: 'images/cat1.jpg' }),
                    new AngryCat({ id:3, name: 'Surprised Cat', image_path: 'images/cat3.jpg' })
                ]);

                cats.add([new AngryCat({ id:4, name: 'Cranky Cat', image_path: 'images/cat4.jpg' })]);

                var catsView = new AngryCatsView({ collection: cats });
                var region = msgBus.reqres.request( "app:request:showRegion");
                return region.show( catsView );
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
            console.log( "cats app:start:route");
            return new Router( "cats", options );
        });

    });
