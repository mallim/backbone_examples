
define([
    'backbone',
    'jquery',
    'libs/msgBus',
    'backbone.marionette',
    'tpl!landing/composite_view',
    'hbs!landing/item_view',
    'underscore',
    'underscore.string',
    'handlebars',
],
function (Backbone, $, msgBus, Marionette, LandingCompositeViewTpl, LandingItemViewTpl, _ ) {

    "use strict";

    //console.log("Staring MainApp")

    // set up the app instance
    var app = new Marionette.Application();

    var LandingItemView = Marionette.ItemView.extend({
        tagName: "li",
        template:LandingItemViewTpl
    });

    var LandingCompositeView = Marionette.CompositeView.extend({
        id: 'backbone_tutorials',
        itemView:LandingItemView,
        itemViewContainer: "ul",
        template:LandingCompositeViewTpl
    });

    var TutorialModel = Backbone.Model.extend({
        isTarget: function() {
            return _.str.substr( this.get('module'), 0, 1 ).equalsIgnoreCase( '!');
        },
        targetURL:function(){
            return _.str.substr( this.get('module'), 1 );
        }
    });

    var TutorialCollection = Backbone.Collection.extend({
        model: TutorialModel
    });

    var _tutorials = new TutorialCollection();
    _tutorials.add( new TutorialModel({id:1, module:"superbasic", description:"Tutorial 1: superbasic (with dialog 1)"}));
    _tutorials.add( new TutorialModel({id:2, module:"events", description:"Tutorial 2: Count - About Events"}));
    _tutorials.add( new TutorialModel({id:3, module:"cats", description:"Tutorial 3: Angry Cats - About Collections"}));
    _tutorials.add( new TutorialModel({id:4, module:"things", description:"Tutorial 4: Things - About Routings"}));
    _tutorials.add( new TutorialModel({id:5, module:"links", description:"Tutorial 5: Links - About Local Storage"}));
    _tutorials.add( new TutorialModel({id:6, module:"tweets", description:"Tutorial 6: Live Collections"}));
    _tutorials.add( new TutorialModel({id:7, module:"!jqgrid_test.html", description:"Example of JQGrid with jQueryUI Bootstrap" }));

    // initialize Marionette regions
    app.addRegions({
        nav:"#tutorial_region",
        content:"#content"
    });

    app.addInitializer(function () {
        var landingView = new LandingCompositeView({collection: _tutorials});
        app.nav.show( landingView );
        return msgBus.events.trigger( "initialize:before" );
    });

    // contextual startup
    app.on("initialize:after", function(){
        msgBus.events.trigger("app:main:show");
        // And hook up history tracking
        if (!Backbone.history.started) {
            return Backbone.history.start();
        }
    });

    app.on("start", function () {
        msgBus.commands.execute("initialize:ui");
    });

    /**
    msgBus.events.on("app:main:show", function(view) {
        return app.mainRegion.show(view);
    });
    **/

    msgBus.reqres.setHandler("app:request:showRegion", function() {
        return defaultLayout.content;
    });

    // export the app from this module
    return app;
});
