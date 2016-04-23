// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var _template = require('./browser-item.hbs');

var BrowserItemView = Backbone.View.extend({
    events: {
    },
    model: null,
    initialize: function (options) {

        this.model = options.model;

    },
    render: function () {

        console.log(this.model);

        var rawHTML = _template({
            model: this.model
        });

        this.$el.append(rawHTML);

        // Fetch will go here
        return this;
    }

});

module.exports = BrowserItemView;