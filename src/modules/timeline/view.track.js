// Library dependencies
var dispatcher = require('dispatcher');

// Application dependencies
var PremixGlobals = require('../../common/config');

// Inner dependencies
var scheduler = require('./scheduler'),
    _trackTemplate = require('./track.hbs');

var TrackView = Backbone.View.extend({
    events: {
    },
    model: null,
    $track: null,
    trackAdded: false,
    isSelected: false,
    initialize: function (options) {
        this.model = options.model;

        this.listenTo(dispatcher, 'timeline:nudgeleft', this.nudgeLeft);
        this.listenTo(dispatcher, 'timeline:nudgeright', this.nudgeRight);


    },
    render: function() {

        var rawHTML = _trackTemplate({
            model: this.model
        });

        this.$el.append(rawHTML);

        this.$track = this.$el.find("#" + this.model.attributes.trackId);

        this.$track.attr("draggable", "true");
        this.$track.bind("dragstart", _.bind(this._dragStartEvent, this));
        this.$track.bind("click", _.bind(this.onClick, this));


        this.$track.css("left", PremixGlobals.timeToPixels(this.model.attributes.trackStartTime));
        this.$track.css("top", this.model.attributes.yPos);
        this.$track.css("width", PremixGlobals.timeToPixels(this.model.attributes.trackLength));


        if(!this.trackAdded) {
            var trackData = {
                trackId: this.model.attributes.trackId,
                url: this.model.attributes.url,
                trackStartTime: this.model.attributes.trackStartTime,
                $el: this.$el,
                trackLength: this.model.attributes.trackLength
            };

            dispatcher.trigger('timeline:trackadded', trackData);

            this.trackAdded = true;
        }

        return this;
    },
    onClick: function(e) {
        this.$track.toggleClass('selected');
        (this.isSelected) ? this.isSelected = false : this.isSelected = true;
    },
    nudgeLeft: function() {

        if(this.isSelected) {

            var newStartTime = this.model.attributes.trackStartTime - PremixGlobals.getNudgeAmount();

            var trackMoveData = {
                trackId: this.model.attributes.trackId,
                startTime: newStartTime,
                yPos: this.model.attributes.yPos
            }

            dispatcher.trigger('timeline:tracknudged', trackMoveData);

        }
    },
    nudgeRight: function() {

        if(this.isSelected) {

            var newStartTime = this.model.attributes.trackStartTime + PremixGlobals.getNudgeAmount();

            var trackMoveData = {
                trackId: this.model.attributes.trackId,
                startTime: newStartTime,
                yPos: this.model.attributes.yPos
            }

            dispatcher.trigger('timeline:tracknudged', trackMoveData);

        }
    },
    _dragStartEvent: function (e) {
        var data
        if (e.originalEvent) e = e.originalEvent;
        e.dataTransfer.effectAllowed = "copy"; // default to copy
        data = this.dragStart(e.dataTransfer, e);

        window._backboneDragDropObject = null;
        if (data !== undefined) {
            window._backboneDragDropObject = data;// we cant bind an object directly because it has to be a string, json just won't do
        }
    },

    dragStart: function (dataTransfer, e) {

        this.$track.addClass('dragging');

        var yOffset = e.clientY - this.$track.offset().top;
        var xOffset = e.clientX - this.$track.offset().left;

        return {
            type: 'timelineTrack',
            model: this.model.attributes,
            yOffset: yOffset,
            xOffset: xOffset
        }
    } // override me, return data to be bound to drag


});

module.exports = TrackView;