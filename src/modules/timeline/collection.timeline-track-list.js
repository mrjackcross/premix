// Inner dependencies
var TimelineTrackModel = require('./model.timeline-track');

var TimelineTrackCollection = Backbone.Collection.extend({
    model: TimelineTrackModel
});

module.exports = TimelineTrackCollection;