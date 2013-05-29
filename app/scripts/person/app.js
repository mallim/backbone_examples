//
// This example is adopted from
// http://www.garethelms.org/2011/12/backbone-js-modal-dialog/
//
define([
    'backbone',
    'backbone.marionette',
    'libs/msgBus',
    'libs/Marionette.SubAppRouter',
    'tpl!person/person_main',
    'libs/Backbone.ModalDialog',
    'backbone.validation',
    'less!person/person.less'
],
function (Backbone, Marionette, msgBus, SubAppRouter, PersonMainViewTpl ) {

    "use strict";

    var modalOptions = {
        closeImageUrl:'images/close-modal.png',
        showCloseButton:false
    }

    var PersonModel = Backbone.Model.extend({
        options:modalOptions,
        validation:
        {
            name: {required:true, msg: "Please enter the person's name."},
            phone: {required:true, msg: "Please enter the person's phone number."},
            email:
                [
                    {required:true, msg: "Please enter the person's email address."},
                    {pattern:"email", msg: "Please enter a valid email address"}
                ]
        }
    });

    var PeopleCollection = Backbone.Collection.extend({
        model: PersonModel
    });

    var AddPersonView = Backbone.ModalView.extend(
    {
            options:modalOptions,
            name: "AddPersonView",
            model: PersonModel,
            templateHtml:
                "<div class='modal-header'>Add a new person to the list</div>" +
                    "<form>" +
                    "<table class='compact'>" +
                    "<tr><td>" +
                    "<label for='name'>Name</label>" +
                    "</td><td>" +
                    "<input type='text' id='name' />" +
                    "</td></tr>" +
                    "<tr><td>" +
                    "<label for='email'>Email</label>" +
                    "</td><td>" +
                    "<input type='text' id='email' />" +
                    "</td></tr>" +
                    "<tr><td>" +
                    "<label for='phone'>Phone</label>" +
                    "</td><td>" +
                    "<input type='text' id='phone' />" +
                    "</td></tr>" +
                    "<tr><td></td><td>" +
                    "<input id='addPersonButton' type='submit' value='Add person' />" +
                    "</td></tr>" +
                    "</table>" +
                    "</form>",
            initialize:
                function()
                {
                    _.bindAll( this, "render");
                    this.template = _.template( this.templateHtml);
                    Backbone.Validation.bind( this,  {valid:this.hideError, invalid:this.showError});
                },
            events:
            {
                "change #email": "validateEmail",
                "submit form": "addPerson"
            },
            getCurrentFormValues:
                function()
                {
                    return {
                        name: $("#name").val(),
                        email: $("#email").val(),
                        phone: $("#phone").val()};
                },
            validateEmail:
                function()
                {
                    this.model.set( {email: $("#email").val()});
                },
            hideError:
                function(  view, attr, selector)
                {
                    var $element = view.$form[attr];

                    $element.removeClass( "error");
                    $element.parent().find( ".error-message").empty();
                },
            showError:
                function( view, attr, errorMessage, selector)
                {
                    var $element = view.$form[attr];

                    $element.addClass( "error");
                    var $errorMessage = $element.parent().find(".error-message");
                    if( $errorMessage.length == 0)
                    {
                        $errorMessage = $("<div class='error-message'></div>");
                        $element.parent().append( $errorMessage);
                    }

                    $errorMessage.empty().append( errorMessage);
                },
            addPerson:
                function( event)
                {
                    event.preventDefault();

                    if( this.model.set( this.getCurrentFormValues()))
                    {
                        this.hideModal();
                        _people.add( this.model);
                    }
                },

            render:
                function()
                {
                    $(this.el).html( this.template());

                    this.$form = {
                        name: this.$("#name"),
                        email: this.$("#email"),
                        phone: this.$("#phone")}

                    return this;
                }
        });

    var PermanentView = Backbone.ModalView.extend(
        {
            options:modalOptions,
            template: "<p style='padding:0 1em;'>Please wait while I prevent you from doing anything.</p>",
            initialize:
                function()
                {
                    this.template = _.template( this.template);
                },
            events:
            {
                "click #escape-route": "close"
            },
            close:
                function( event)
                {
                    event.preventDefault();
                    this.hideModal();
                    $('#test-permanent').append( "<span style='font-size:70%;'>. I enjoyed that.</span>");
                },
            escapeRoute:
                function( view)
                {
                    this.$el.append( "<p style='padding:0 1em; text-align:center;'><a href='' id='escape-route'>Ok, I'll let you close now. But I don't have to.</a></p>");
                    this.recentre();
                },
            render:
                function()
                {
                    this.$el.html( this.template());
                    window.setTimeout( _.bind( this.escapeRoute, this), 5000);
                    return this;
                }
        });

    var PersonItemView = Marionette.ItemView.extend({
        template:Handlebars.compile("<div><span>{{name}}</span><br /><em>{{email}}</em><br /><em>{{phone}}</em></div>"),
        tagName: "li"
    });

    var PeopleListView = Marionette.CompositeView.extend({

        itemView:PersonItemView,
        template:PersonMainViewTpl,
        itemViewContainer: "ul#people",
        id:'people_list_view',

        events: {
            'click #addPersonButton': 'addNewPerson',
            'click #test-no-config':'testNoConfig',
            'click #test-permanent':'testPerm'
        },

        initialize:function(){
            this.collection.bind("add", this.renderNewPerson, this);
            this.collection.bind("remove", this.render, this);
        },
        renderNewPerson:function( personModel){
            var html = new PersonItemView( {model : personModel}).render().el;
            $(this.el).append( html);
        },
        addNewPerson:function( event ){
            console.log( "yes, I'm going to add a new person");
            event.preventDefault();
            event.stopPropagation();
            // Create the modal view
            var model = new PersonModel();
            var view = new AddPersonView( {model:model});
            view.render().showModal({
                x: event.pageX,
                y: event.pageY
            });
        },
        testNoConfig:function( event ){
            event.preventDefault();
            event.stopPropagation();

            var model = new PersonModel();
            var view = new AddPersonView( {model:model});
            view.render().showModal();
        },
        testPerm:function( event ){
            event.preventDefault();
            var view = new PermanentView();
            view.render().( {permanentlyVisible: true});
        }
    });

    var _people = new PeopleCollection();
    _people.add( new PersonModel({name: "Person 1", email:"person1@email.com", phone:"011-11-111"}));
    _people.add( new PersonModel({name: "Person 2", email:"person2@email.com", phone:"022-22-222"}));
    _people.add( new PersonModel({name: "Person 3", email:"person3@email.com", phone:"03-333-333"}));

    var Controller = Marionette.Controller.extend({
        load: function(){
            var mainView = new PeopleListView({collection: _people});
            var region = msgBus.reqres.request( "app:request:showRegion");
            return region.show( mainView );
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
        console.log( "person app:start:route");
        return new Router( "person", options );
    });

});
