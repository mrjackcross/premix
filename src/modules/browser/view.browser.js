// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var _template = require('./browser.hbs');


var BrowserView = Backbone.View.extend({

    initialize: function (options) {

    },
    render: function () {
        var rawHTML = _template({

        });

        this.$el.html(rawHTML);

        return this;
    }

});

module.exports = BrowserView;