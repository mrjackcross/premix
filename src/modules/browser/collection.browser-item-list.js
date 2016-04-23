// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Inner dependencies
var BrowserItemModel = require('./model.browser-item');

var BrowserItemCollection = Backbone.Collection.extend({
    model: BrowserItemModel
});

module.exports = BrowserItemCollection;