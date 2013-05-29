define([
    'backbone'
],
function( Backbone ) {

    var StreamCollection = Backbone.Collection.extend({
        stream: function(options) {

            // Cancel any potential previous stream
            this.unstream();

            var _update = _.bind(function() {
                this.fetch(options);
                this._intervalFetch = window.setTimeout(_update, options.interval || 1000);
            }, this);

            _update();
        },

        unstream: function() {
            window.clearTimeout(this._intervalFetch);
            delete this._intervalFetch;
        },

        isStreaming : function() {
            return _.isUndefined(this._intervalFetch);
        }
    });

    return StreamCollection;

});