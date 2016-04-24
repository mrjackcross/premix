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
    initialize: function (options) {

        this.collection = new TimelineTrackCollection();
        this.listenTo( this.collection, 'add', this.render );

        this.listenTo(dispatcher, 'timeline:stepchanged', this.stepChanged);

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

        this.collection.each(function (model) {

            var trackView = new TrackView({
                model: model,
                el: $tel
            });

            // Render the new track
            trackView.render();

        });

        dispatcher.trigger('timeline:ready');
        return this;
    },
    stepChanged: function (currentTime) {

        // Move the playhead
        var playHeadXOffset = PremixGlobals.timeToPixels(currentTime);

        this.$el.find("#playhead").css("left", playHeadXOffset + "px");
    },
    addTrack: function(trackData){

        // // Check for duplicates and append and index if so
        // var existingTrackIds = {};
        //
        // var originalId = trackData.trackId;
        // var uniqueTrackId;
        //
        // this.collection.each(function(model) {
        //
        //     var pos = model.attributes.trackId.lastIndexOf('-');
        //     if(pos != -1) {
        //         originalId = trackData.trackId.substring(0,pos);
        //     }
        //
        //     if (existingTrackIds[originalId]) {
        //         existingTrackIds[originalId] += existingTrackIds[originalId];
        //     } else {
        //         existingTrackIds[originalId] = 1;
        //     }
        // });
        //
        // if(existingTrackIds[originalId]) {
        //     uniqueTrackId = originalId + '-' + existingTrackIds[originalId];
        // }

        var track = new TimelineTrackModel({
            name: trackData.name,
            trackId: trackData.trackId + this.uniqueId++,
            url: trackData.url,
            yPos: trackData.yPos,
            startTime: trackData.startTime
        });

        this.collection.add(track);
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

        //TODO If this is a browser item
        data.yPos = e.pageY;
        data.startTime = PremixGlobals.pixelsToTime(e.pageX);
        this.addTrack(data);

    } // overide me!  if the draggable class returned some data on 'dragStart' it will be the first argument

});

module.exports = TimelineView;