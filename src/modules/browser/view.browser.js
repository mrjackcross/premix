// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var BrowserItemView = require('./view.browser-item'),
    _template = require('./browser.hbs'),
    BrowserItemModel = require('./model.browser-item'),
    BrowserItemCollection = require('./collection.browser-item-list');

var spotifyEndpoint = 'https://api.spotify.com/v1/';
var spotifySearchUri = 'search?q=%QUERY%&type=track&limit=10';


var BrowserView = Backbone.View.extend({
    events: {
        'change #browser-search': 'searchChanged'
    },
    initialize: function (options) {
        // var browserItem2 = new BrowserItemModel({
        //     name: 'Kick',
        //     trackId: 'kick',
        //     url: 'assets/samples/kick.wav',
        //     trackLength: 1
        // });
        // var browserItem1 = new BrowserItemModel({
        //     name: 'Snare',
        //     trackId: 'snare',
        //     url: 'assets/samples/snare.wav',
        //     trackLength: 1
        // });
        // var browserItem4 = new BrowserItemModel({
        //     name: 'Closed HiHat',
        //     trackId: 'closedhihat',
        //     url: 'assets/samples/closedHat.wav',
        //     trackLength: 1
        // });
        // var browserItem3 = new BrowserItemModel({
        //     name: 'Open HiHat',
        //     trackId: 'openhihat',
        //     url: 'assets/samples/openHat.wav',
        //     trackLength: 1
        // });
        // var browserItem5 = new BrowserItemModel({
        //     name: 'Trolley Snatcha - The Future',
        //     trackId: 'trolley-snatcher',
        //     url: 'assets/samples/trolley-snatcher.mp3',
        //     trackLength: 360
        // });
        // var browserItem6 = new BrowserItemModel({
        //     name: 'RedEye',
        //     trackId: 'red-eye',
        //     url: 'assets/samples/redeye.mp3',
        //     trackLength: 360
        // });
        // var browserItem7 = new BrowserItemModel({
        //     name: 'Trust Nobody',
        //     trackId: 'trust-nobody',
        //     url: 'assets/samples/trustnobody.mp3',
        //     trackLength: 360
        // });
        // var browserItem8 = new BrowserItemModel({
        //     name: 'Downlink - Gamma Ray',
        //     trackId: 'downlink',
        //     url: 'assets/samples/downlink.mp3',
        //     trackLength: 360
        // });
        // var browserItem9 = new BrowserItemModel({
        //     name: 'Open HiHat',
        //     trackId: 'openhihat',
        //     url: 'assets/samples/openHat.wav',
        //     trackLength: 360
        // });
        // var browserItem10 = new BrowserItemModel({
        //     name: 'Calibre - Gone Away',
        //     trackId: 'dnb',
        //     url: 'assets/samples/06-calibre-gone_away.mp3',
        //     trackLength: 360
        // });
        //
        //
        //
        // this.collection = new BrowserItemCollection([
        //     browserItem6,
        //     browserItem7,
        //     browserItem8,
        //     browserItem9,
        //     browserItem5,
        //     browserItem10,
        //     browserItem2,
        //     browserItem3,
        //     browserItem4,
        //     browserItem1]
        // );

        this.collection = new BrowserItemCollection();

        //this.listenTo( this.collection, 'reset add change remove', this.render, this );
    },
    render: function (searchQuery) {
        var rawHTML = _template({
        });

        this.$el.html(rawHTML);

        var $iel = this.$el.find('#browser-items');

        this.collection.each(function (model) {

            var rawHTML = '<div class';
            
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
            this.collection.url = spotifyEndpoint + spotifySearchUri.replace("%QUERY%", encodeURI(val));

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