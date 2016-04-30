// Application dependencies
var dispatcher = require('dispatcher'),
    PremixGlobals = require('../../common/config');


// Inner dependencies
var BrowserItemView = require('./view.browser-item'),
    _template = require('./browser.hbs'),
    SearchResults = require('./collection.search-results');

var searchUri = 'search/omnify?q=%QUERY%';


var BrowserView = Backbone.View.extend({
    events: {
        'change #browser-search': 'searchChanged'
    },
    initialize: function (options) {
        this.collection = new SearchResults();
    },
    render: function (searchQuery) {
        var rawHTML = _template({
        });

        this.$el.html(rawHTML);

        var $iel = this.$el.find('#browser-items');

        this.collection.each(function (model) {
            
            var browserItemView = new BrowserItemView({
                model: model,
                el: $iel
            }).render();

        });

        if(searchQuery) {
            this.$el.find('#browser-search').val(searchQuery);
        }

        this.delegateEvents();

        return this;
    },
    searchChanged: function (e) {

        e.preventDefault();

        var self = this;
        var val = this.$el.find('#browser-search').val();

        if(val.length > 2) {
            this.collection.url = PremixGlobals.getStudioHost() + ':' + PremixGlobals.getStudioPort() + PremixGlobals.getStudioBasePath() + searchUri.replace("%QUERY%", encodeURI(val));

            this.collection.fetch({
                success: function(data) {

                    self.render(val);

                },
                error: function(err) {
                    console.log('Error fetching Spotify search results. Error: ' + err);
                }

            });
        }

    }

});

module.exports = BrowserView;