define([
    "../app",
    "backbone.marionette",
    'tpl!landing/composite_view',
    'hbs!landing/item_view',
    'underscore',
    'underscore.string',
    'handlebars'

], function( app, Marionette, LandingCompositeViewTpl, LandingItemViewTpl, _  ){

    var LandingModule = app.module( "landing" );

    var LandingItemView = Marionette.ItemView.extend({
        tagName: "li",
        template:LandingItemViewTpl,
        events: {
            'click a': 'routeToMain'
        },
        routeToMain: function(event) {
            if( this.model.get( 'isTarget' ) ) {
                //app.router.navigate('/', {trigger: true});
                return;
            }
            if( this.model.get("stopLanding") ) LandingModule.stop();
            require( [ this.model.moduleURL() ], function( module ) {
                module.start();
                app.vent.trigger("module:start", module );
            });
        }
    });

    var LandingCompositeView = Marionette.CompositeView.extend({
        id: 'backbone_tutorials',
        itemView:LandingItemView,
        itemViewContainer: "ul",
        template:LandingCompositeViewTpl
    });

    var TutorialModel = Backbone.Model.extend({
        defaults:{
            stopLanding:true,
            isTarget:false,
            targetURL:null
        },
        initialize:function(){
            this.set( 'isTarget',  _.str.startsWith( this.get('module'), '!' ) );
            this.set( 'targetURL', this.get( 'module').substring( 1 ) );
        },
        moduleURL:function(){
            return this.get("module") + "/module";
        }
    });

    var TutorialCollection = Backbone.Collection.extend({
        model: TutorialModel
    });

    var _tutorials = new TutorialCollection();
    _tutorials.add( new TutorialModel({id:1, module:"superbasic", description:"Tutorial 1: superbasic (with dialog 1)", stopLanding:false}));
    _tutorials.add( new TutorialModel({id:2, module:"count", description:"Tutorial 2: Count - About Events"}));
    _tutorials.add( new TutorialModel({id:3, module:"cats", description:"Tutorial 3: Angry Cats - About Collections"}));
    _tutorials.add( new TutorialModel({id:4, module:"things", description:"Tutorial 4: Things - About Routings"}));
    _tutorials.add( new TutorialModel({id:5, module:"links", description:"Tutorial 5: Links - About Local Storage"}));
    _tutorials.add( new TutorialModel({id:6, module:"tweets", description:"Tutorial 6: Live Collections. Twitter no result!"}));
    _tutorials.add( new TutorialModel({id:7, module:"!jqgrid_test.html", description:"Example of JQGrid with jQueryUI Bootstrap", stopLanding:false }));

    LandingModule.addInitializer(function(){
        LandingModule.mainView = new LandingCompositeView({collection: _tutorials});
        app.nav.show( LandingModule.mainView );
    });

    LandingModule.addFinalizer(function(){
        LandingModule.mainView.close();
    });

    return LandingModule;
});
