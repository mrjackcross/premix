// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Application dependencies
var dispatcher = require('dispatcher'),
    PremixGlobals = require('../../common/config');

// Inner dependencies
var TrackView = require('./view.track'),
    _template = require('./timeline.hbs');


var TimelineView = Backbone.View.extend({
    events: {
        'mousemove': 'onMouseMove',
        'mouseup': 'onMouseUp'
    },
    trackViews: {},
    initialize: function (options) {
        this.listenTo(dispatcher, 'timeline:stepchanged', this.stepChanged);
    },
    render: function () {
        var rawHTML = _template({

        });

        this.$el.html(rawHTML);
        
        this.$el.find('#timeline').css("width", PremixGlobals.getTimelineWidth());

        this.addTrack('kick', 'assets/samples/kick.wav');
        this.addTrack('snare', 'assets/samples/snare.wav');
        this.addTrack('snare', 'assets/samples/snare.wav');
        
        dispatcher.trigger('timeline:ready');
        return this;
    },
    stepChanged: function (currentTime) {
        
        var playHeadXOffset = PremixGlobals.timeToPixels(currentTime);

        this.$el.find("#playhead").css("left", playHeadXOffset + "px");
    },
    addTrack: function(trackId, url){

        var $tel = this.$el.find('#timeline-tracks');
        var existingTrackIds = {};

        // Check for duplicates and append and index if so
        for (var key in this.trackViews) {
            if (!this.trackViews.hasOwnProperty(key)) continue;
            var trackView = this.trackViews[key];

            if(existingTrackIds[trackView.id]) {
                existingTrackIds[trackView.id] += existingTrackIds[trackView.id]
            } else {
                existingTrackIds[trackView.id] = 1;
            }
        }

        if(existingTrackIds[trackId]) {
            trackId += '-' + existingTrackIds[trackId];
        }

        var trackView = new TrackView({
            id: trackId,
            url: url,
            el: $tel
        });
        this.trackViews[trackId] = trackView;

        // Render the new track
        trackView.render();
    }

});

module.exports = TimelineView;