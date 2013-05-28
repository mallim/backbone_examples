//
// Code from https://github.com/t2k/backbone.marionette-RequireJS/blob/master/assetsAMD/js/msgbus.js
//
// msgBus module that leverages backbone.Wreqr events,
// commands and request/response patterns
// to facilitate inter-application communication.
//
define(["backbone.wreqr"], function(Wreqr) {
    return {
        reqres: new Wreqr.RequestResponse(),
        commands: new Wreqr.Commands(),
        events: new Wreqr.EventAggregator()
    };
});