// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var TrackView = require('./view.track'),
    _template = require('./timeline.hbs');


var TimelineView = Backbone.View.extend({
    events: {
      'mousemove': 'onMouseMove', 
        'mouseup': 'onMouseUp'
    },
    trackViews: [],
    initialize: function (options) {
        this.listenTo(dispatcher, 'timeline:stepchanged', this.stepChanged);
    },
    render: function () {
        var rawHTML = _template({

        });

        this.$el.html(rawHTML);

        this.addTrack('snare');

        dispatcher.trigger('timeline:ready');

        return this;
    },
    stepChanged: function (currentTime) {

        var totalTime = 10.0;
        var totalLength = this.$el.find('#timeline-tracks').width();
        var playHeadXOffset = (currentTime / totalTime) * totalLength;
        
        this.$el.find("#playhead").css("left", playHeadXOffset + "px");
    },
    addTrack: function(trackId){
        
        var $tel = this.$el.find('#timeline-tracks');
        this.trackViews.push(new TrackView({
            id: trackId,
            el: $tel
        }));
        for (var k in this.trackViews) {
            this.trackViews[k].render();
        }
        
    }

});

module.exports = TimelineView;