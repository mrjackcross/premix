// Application dependencies
var dispatcher = require('dispatcher'),
    PremixGlobals = require('../../common/config');

// Inner dependencies
var TrackView = require('./view.track'),
    _template = require('./timeline.hbs'),
    TimelineTrackModel = require('./model.timeline-track'),
    TimelineTrackCollection = require('./collection.timeline-track-list');


var TimelineView = Backbone.View.extend({
    events: {
        'mousemove': 'onMouseMove',
        'mouseup': 'onMouseUp'
    },
    uniqueId: 0,
    trackViews: null,
    initialize: function (options) {

        this.collection = new TimelineTrackCollection();

        this.listenTo(dispatcher, 'timeline:stepchanged', this.stepChanged);
        this.listenTo(dispatcher, 'timeline:tracknudged', this.trackMoved);


        this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
        this.$el.bind("dragenter", _.bind(this._dragEnterEvent, this));
        this.$el.bind("dragleave", _.bind(this._dragLeaveEvent, this));
        this.$el.bind("drop", _.bind(this._dropEvent, this));
        this._draghoverClassAdded = false
    },
    render: function () {
        var rawHTML = _template({

        });

        this.$el.html(rawHTML);

        this.$el.find('#timeline').css("width", PremixGlobals.getTimelineWidth());

        var $tel = this.$el.find('#timeline-tracks');

        this.trackViews = this.collection.map(function(model) {
            var trackView = new TrackView({
                model: model,
                el: $tel
            });
            this.$el.append(trackView.render().el);
            return trackView;
        }, this);

        dispatcher.trigger('timeline:ready');
        return this;
    },
    stepChanged: function (currentTime) {

        // Move the playhead
        var playHeadXOffset = PremixGlobals.timeToPixels(currentTime);

        this.$el.find("#playhead").css("left", playHeadXOffset + "px");
    },
    addTrack: function(trackData){

        var $tel = this.$el.find('#timeline-tracks');

        var trackLength = trackData.trackLength / 1000.0;
        var bpm = trackData.trackBpm;
        var url = trackData.trackUrl;

        // Use the 30 second preview if the full track isn't available
        if(trackData.trackUrl === 'Not Available') {
            url = trackData.trackPreviewUrl;
            trackLength = 30;
        }

        var track = new TimelineTrackModel({
            name: trackData.trackArtist + ' - ' + trackData.trackName,
            trackId: 'track-' + trackData.id + '-' + this.uniqueId++,
            url: url,
            yPos: trackData.yPos,
            trackStartTime: trackData.startTime,
            trackLength: trackLength,
            bpm: bpm
        });

        this.collection.add(track);

        var trackView = new TrackView({
            model: track,
            el: $tel
        });

        this.$el.append(trackView.render().el);

        this.trackViews.push(trackView);
    },
    trackMoved: function(trackMoveData) {

        this.trackViews.forEach(function(trackView){

            if(trackView.model.attributes.trackId === trackMoveData.trackId) {

                trackView.model.set({
                    trackStartTime: trackMoveData.startTime,
                    yPos: trackMoveData.yPos
                });

                trackView.$track.css("left", PremixGlobals.timeToPixels(trackView.model.attributes.trackStartTime));
                trackView.$track.css("top", trackView.model.attributes.yPos);
            }

        });

        var trackData = {
            trackId: trackMoveData.trackId,
            xPos: PremixGlobals.timeToPixels(trackMoveData.startTime)
        };
        dispatcher.trigger('timeline:trackmoved', trackData);
    },
    _dragOverEvent: function (e) {
        if (e.originalEvent) e = e.originalEvent
        var data = this._getCurrentDragData(e)

        if (this.dragOver(data, e.dataTransfer, e) !== false) {
            if (e.preventDefault) e.preventDefault()
            e.dataTransfer.dropEffect = 'copy' // default
        }
    },

    _dragEnterEvent: function (e) {
        if (e.originalEvent) e = e.originalEvent
        if (e.preventDefault) e.preventDefault()
    },

    _dragLeaveEvent: function (e) {
        if (e.originalEvent) e = e.originalEvent
        var data = this._getCurrentDragData(e)
        this.dragLeave(data, e.dataTransfer, e)
    },

    _dropEvent: function (e) {
        if (e.originalEvent) e = e.originalEvent
        var data = this._getCurrentDragData(e)

        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting

        if (this._draghoverClassAdded) this.$el.removeClass("draghover")

        this.drop(data, e.dataTransfer, e)
    },

    _getCurrentDragData: function (e) {
        var data = null
        if (window._backboneDragDropObject) data = window._backboneDragDropObject
        return data
    },

    dragOver: function (data, dataTransfer, e) { // optionally override me and set dataTransfer.dropEffect, return false if the data is not droppable
        this.$el.addClass("draghover")
        this._draghoverClassAdded = true
    },

    dragLeave: function (data, dataTransfer, e) { // optionally override me
        if (this._draghoverClassAdded) this.$el.removeClass("draghover")
    },

    drop: function (data, dataTransfer, e) {

        switch(data.type) {
            case 'browserItem':
                data.model.yPos = (e.clientY - this.$el.offset().top) - data.yOffset;
                data.model.startTime = PremixGlobals.pixelsToTime(((e.clientX + this.$el.scrollLeft()) - this.$el.offset().left) - data.xOffset);
                this.addTrack(data.model);
                break;
            case 'timelineTrack':
                data.model.yPos = (e.clientY - this.$el.offset().top) - data.yOffset;
                data.model.startTime = PremixGlobals.pixelsToTime(((e.clientX + this.$el.scrollLeft()) - this.$el.offset().left) - data.xOffset);
                this.trackMoved(data.model);
                break;
            default:
            // Do nothing
        }

    } // overide me!  if the draggable class returned some data on 'dragStart' it will be the first argument

});

module.exports = TimelineView;