// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery'),
    dispatcher = require('dispatcher');

// Inner dependencies
var scheduler = require('./scheduler'),
    _trackTemplate = require('./track.hbs');

var TrackView = Backbone.View.extend({
    events: {
        'mousedown': 'onMouseDown'
    },
    $track: null,
    trackId: null,
    dragging: false,
    initialize: function (options) {
        this.trackId = options.id;
        this.listenTo(dispatcher, 'resizer:mouseup', this.onResizerMouseUp);
        this.listenTo(dispatcher, 'resizer:mousemove', this.onResizerMouseMove);

    },
    render: function() {

        var rawHTML = _trackTemplate({
            id: this.trackId
        });

        this.$el.append(rawHTML);

        this.$track = this.$el.find("#" + this.trackId);

        return this;
    },
    onMouseDown: function (e) {
        this.dragging = true;
    },
    onResizerMouseMove: function (e) {

        if (this.dragging) {

            var dragX = e.pageX - (this.$track.width()/2);
            var dragY = e.pageY - (this.$track.height());

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
            var data = {
                trackId: this.trackId,
                xPos: this.$track.css("left")
            };
            dispatcher.trigger('timeline:trackmoved', data);
        }
    }

});

module.exports = TrackView;