// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Inner dependencies
var TimelineTrackModel = require('./model.timeline-track');

var TimelineTrackCollection = Backbone.Collection.extend({
    model: TimelineTrackModel
});

module.exports = TimelineTrackCollection;