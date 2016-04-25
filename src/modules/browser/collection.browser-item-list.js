// Inner dependencies
var BrowserItemModel = require('./model.browser-item');

var BrowserItemCollection = Backbone.Collection.extend({
    model: BrowserItemModel,
    parse: function(data) {
        return data.tracks.items;
    }
});

module.exports = BrowserItemCollection;