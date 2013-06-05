// Here we setup path aliases and dependencies
requirejs.config({

    paths:{
        // START List those which are manage by bower first
        backbone:'vendor/backbone/backbone',
        'backbone.marionette':'vendor/marionette/backbone.marionette',
        'backbone.babysitter':'vendor/backbone.babysitter/backbone.babysitter',
        'backbone.stickit':'vendor/backbone.stickit/backbone.stickit',
        'backbone.validation':'vendor/backbone-validation/backbone-validation-amd',
        'backbone.wreqr':'vendor/backbone.wreqr/backbone.wreqr',
        'bootstrap':'vendor/bootstrap/js/bootstrap',
        chai:'vendor/chai/chai',
        css:'vendor/require-css/css',
        'css-builder':'vendor/require-css/css-builder',
        domReady:"vendor/requirejs-domready/domReady",
        handlebars:"vendor/handlebars.js/handlebars",
        hbs:"vendor/require-handlebars-plugin/hbs",
        i18nprecompile:'vendor/require-handlebars-plugin/i18n/i18nprecompile',
        image:'vendor/requirejs-plugins/image',
        json:'vendor/requirejs-plugins/json',
        json2:'vendor/json2/json2',
        jquery:'vendor/jquery/jquery',
        less:'vendor/require-less/less',
        'less-builder':'vendor/require-less/less-builder',
        lessc:'vendor/require-less/lessc',
        'lessc-server':'vendor/require-less/lessc-server',
        localstorage:'vendor/Backbone.localStorage/backbone.localStorage',
        mocha:'vendor/mocha/mocha',
        modernizr:'vendor/modernizr/modernizr',
        normalize:'vendor/require-css/normalize',
        underscore:'vendor/lodash/lodash.underscore',
        "underscore.string":'vendor/underscore.string/underscore.string',
        text:'vendor/requirejs-text/text',
		tpl:'vendor/requirejs-tpl/tpl',
        // END List those which are manage by bower first

        // This one cannot be updated by using bower
        'bootstrap-modal':'libs/backbone.bootstrap-modal',
        'modalDialog':'libs/Backbone.ModalDialog'
        // From here onwardds, the config are for our own internal usage
    },

    shim:{
        backbone:{
            // These script dependencies should be loaded before loading backbone.js
            deps:["underscore", "jquery", "json2" ],
            exports:"Backbone"
        },
        'backbone.marionette' : {
            deps : ['jquery', 'underscore', 'backbone'],
            exports:"Backbone.Marionette"
        },
        'bootstrap-modal':{
            deps : ['jquery', 'underscore', 'backbone', 'bootstrap' ],
            exports:"Backbone.BootstrapModal"
        },
        'backbone.stickit':{
            deps:["backbone"]
        },
        'bootstrap':{
            deps:['jquery']
        },
        handlebars:{
            exports:"Handlebars"
        },
        hbs:{
            deps:[ 'handlebars', 'json2' ]
        },
        jquery:{
            exports:'$'
        },
        json2:{
            exports:'JSON'
        },
        modalDialog:{
            deps : ['backbone']
        },
        tpl:{
            deps:['text']
        },
        underscore:{
            exports: '_'
        },
        'underscore.string': {
            deps: ['underscore']
        }
    },

    tpl: {
        extension: '.tpl'
    },

    // hbs config
    hbs: {
        disableI18n: true,        // This disables the i18n helper and
        // doesn't require the json i18n files (e.g. en_us.json)
        // (false by default)

        // disableHelpers: true,     // When true, won't look for and try to automatically load helpers (false by default)

        // templateExtension: "html", // Set the extension automatically appended to templates
        // ('hbs' by default)

        compileOptions: {},        // options object which is passed to Handlebars compiler

        helperDirectory:'helpers'
    }
});