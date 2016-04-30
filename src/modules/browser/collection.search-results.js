// Inner dependencies
var SearchResult = require('./model.search-result');

var SearchResults = Backbone.Collection.extend({
    model: SearchResult,
    parse: function(data) {
        return data.results;
    }
});

module.exports = SearchResults;