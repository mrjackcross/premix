// Library dependencies
var dispatcher = require('dispatcher');

// Application dependencies
var PremixGlobals = require('../../common/config');

// Inner dependencies
var scheduler = require('./scheduler'),
    _trackTemplate = require('./track.hbs');

var TrackView = Backbone.View.extend({
    events: {
        'mousedown .track': 'onMouseDown'
    },
    model: null,
    $track: null,
    dragging: false,
    initialize: function (options) {
        this.model = options.model;
        this.listenTo(dispatcher, 'resizer:mouseup', this.onResizerMouseUp);
        this.listenTo(dispatcher, 'resizer:mousemove', this.onResizerMouseMove);

    },
    render: function() {

        var rawHTML = _trackTemplate({
            model: this.model
        });

        this.$el.append(rawHTML);

        this.$track = this.$el.find("#" + this.model.attributes.trackId);

        this.$track.css("left", PremixGlobals.timeToPixels(this.model.attributes.startTime));
        this.$track.css("top", this.model.attributes.yPos);

        var trackData = {
            trackId: this.model.attributes.trackId,
            url: this.model.attributes.url,
            trackStartTime: this.model.attributes.startTime
        };

        dispatcher.trigger('timeline:trackadded', trackData);

        return this;
    },
    onMouseDown: function (e) {
        if(e.currentTarget.id == this.model.attributes.trackId) {
            this.dragging = true;
        }
    },
    onResizerMouseMove: function (e) {

        if (this.dragging) {

            var timelineXPos = (e.pageX - $('#timeline-tracks').offset().left);
            var timelineYPos = (e.pageY - $('#timeline-tracks').offset().top);

            var dragX = timelineXPos - 20;
            var dragY = timelineYPos - 20;

            this.$track.css("left", dragX);
            this.$track.css("top", dragY);

            // Constrain the track to the timeline
            if(this.$track.css("left").replace("px", "") > (this.$el.width()-this.$track.width()))  {
                this.$track.css("left", this.$el.width()-this.$track.width());
            }
            if(this.$track.css("left").replace("px", "") < 0)  {
                this.$track.css("left", 0);
            }
            if(this.$track.css("top").replace("px", "") > (this.$el.height()-this.$track.height()))  {
                this.$track.css("top", this.$el.height()-this.$track.height());
            }
            if(this.$track.css("top").replace("px", "") < 15)  {
                this.$track.css("top", 15);
            }
        }

    },
    onResizerMouseUp: function(e) {
        if(this.dragging){
            this.dragging = false;
            
            var trackData = {
                trackId: this.model.attributes.trackId,
                xPos: this.$track.css("left").replace("px", "")
            };
            dispatcher.trigger('timeline:trackmoved', trackData);
        }
    }

});

module.exports = TrackView;