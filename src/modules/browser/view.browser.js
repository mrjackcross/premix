// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var BrowserItemView = require('./view.browser-item'),
    _template = require('./browser.hbs'),
    BrowserItemModel = require('./model.browser-item'),
    BrowserItemCollection = require('./collection.browser-item-list');

var BrowserView = Backbone.View.extend({
    events: {
    },
    initialize: function (options) {
        var browserItem2 = new BrowserItemModel({
            name: 'Kick',
            trackId: 'kick',
            url: 'assets/samples/kick.wav'
        });
        var browserItem1 = new BrowserItemModel({
            name: 'Snare',
            trackId: 'snare',
            url: 'assets/samples/snare.wav'
        });
        var browserItem4 = new BrowserItemModel({
            name: 'Closed HiHat',
            trackId: 'closedhihat',
            url: 'assets/samples/closedHat.wav'
        });
        var browserItem3 = new BrowserItemModel({
            name: 'Open HiHat',
            trackId: 'openhihat',
            url: 'assets/samples/openHat.wav'
        });
        var browserItem5 = new BrowserItemModel({
            name: 'Trolley Snatcha - The Future',
            trackId: 'trolley-snatcher',
            url: 'assets/samples/trolley-snatcher.mp3'
        });
        var browserItem6 = new BrowserItemModel({
            name: 'RedEye',
            trackId: 'red-eye',
            url: 'assets/samples/redeye.mp3'
        });
        var browserItem7 = new BrowserItemModel({
            name: 'Trust Nobody',
            trackId: 'trust-nobody',
            url: 'assets/samples/trustnobody.mp3'
        });
        var browserItem8 = new BrowserItemModel({
            name: 'Downlink - Gamma Ray',
            trackId: 'downlink',
            url: 'assets/samples/downlink.mp3'
        });
        var browserItem9 = new BrowserItemModel({
            name: 'Open HiHat',
            trackId: 'openhihat',
            url: 'assets/samples/openHat.wav'
        });
        var browserItem10 = new BrowserItemModel({
            name: 'Calibre - Gone Away',
            trackId: 'dnb',
            url: 'assets/samples/06-calibre-gone_away.mp3'
        });



        this.collection = new BrowserItemCollection([
            browserItem6,
            browserItem7,
            browserItem8,
            browserItem9,
            browserItem5,
            browserItem10,
            browserItem2,
            browserItem3,
            browserItem4,
            browserItem1]
        );

        this.collection.on('change', this.render, this);

        // Fetch will go here
    },
    render: function () {
        var rawHTML = _template({
        });

        this.$el.html(rawHTML);

        var $iel = this.$el.find('#browser-items');

        this.collection.each(function (model) {

            var browserItemView = new BrowserItemView({
                model: model,
                el: $iel
            });

            // Render the item
            browserItemView.render();

        });

        return this;
    },
    buttonClicked: function (e) {

    }

});

module.exports = BrowserView;