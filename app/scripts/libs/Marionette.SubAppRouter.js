// This is heavily based on Backbone.SubRoute (https://github.com/ModelN/backbone.subroute) by Dave Cadwallader, who
// helped me out in this discussion thread:
// https://groups.google.com/forum/?fromgroups=#!topic/backbone-marionette/KTw7USoA6Gs
//
// Adoped from https://gist.github.com/isochronous/4185418
//
;define([
    'underscore',
    'backbone.marionette'
],

/**
 * A module that defines and adds Marionette.SubAppRouter to the Marionette object
 * @module marionette.subapprouter
 * @requires module:marionette
 * @param {Function} Marionette - Marionette.js
 * @exports marionette
 */
function(_, Marionette) {

    /**
     * Creates an AppRouter with a particular prefix at the beginning of each route.
     * @class Marionette.SubAppRouter
     * @alias module:marionette.subapprouter
     * @classdesc A router that prepends a specified prefix (passed on instantiation) onto each specified `route` or
     * `appRoute`.  Directly extends from Marionette.AppRouter to enable controller objects linked to the `appRoutes`
     * hash. Useful for sub applications that live in sub-directories under root and want to handle all of their own
     * routing.
     */
    Marionette.SubAppRouter = Marionette.AppRouter.extend({

        /**
         * @constructs Marionette.SubAppRouter
         * @param {string} [prefix] - The prefix string to prepend to all routes, making them act as if relative. If
         * blank, then it just acts like a regular Backbone.Router.
         * @param {Object} [options] - The options object expected by Marionette.AppRouter.
         * @param {Object} [options.controller] - An object with function properties corresponding to the hash values
         * from `routes` and `appRoutes`.
         */
        constructor: function(prefix, options) {

            var controller,
                appRoutes,
                routes = {};

            // Prefix is optional, set to empty string if not passed
            this.prefix = prefix = prefix || "";

            // SubRoute instances may be instantiated using a prefix with or without a trailing slash.
            // If the prefix does *not* have a trailing slash, we need to insert a slash as a separator
            // between the prefix and the sub-route path for each route that we register with Backbone.
            this.separator =
                    ( prefix.slice( -1 ) === "/" )
                            ? ""
                            : "/";

            // if you want to match "books" and "books/" without creating separate routes, set this
            // option to "true" and the sub-router will automatically create those routes for you.
            var createTrailingSlashRoutes = options && options.createTrailingSlashRoutes;

            if(this.appRoutes) {

                appRoutes = this.appRoutes;
                controller = this.controller;

                if(options && options.controller) {
                    controller = options.controller;
                }

                _.each(appRoutes, function(callback, path) {

                    if (path) {

                        // strip off any leading slashes in the sub-route path,
                        // since we already handle inserting them when needed.
                        if (path.substr(0) === "/") {
                            path = path.substr(1, path.length);
                        }

                        routes[prefix + this.separator + path] = callback;

                        if (createTrailingSlashRoutes) {
                            routes[prefix + this.separator + path + "/"] = callback;
                        }

                    } else {
                        // default routes (those with a path equal to the empty string)
                        // are simply registered using the prefix as the route path.
                        routes[prefix] = callback;

                        if (createTrailingSlashRoutes) {
                            routes[prefix + "/"] = callback;
                        }
                    }

                }, this);

                // Override the local sub-routes with the fully-qualified routes that we just set up.
                this.appRoutes = routes;

            }

            Marionette.AppRouter.prototype.constructor.call(this, options);
        }

    });

    return Marionette.SubAppRouter;

});