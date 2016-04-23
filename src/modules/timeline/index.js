// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var scheduler = require('./scheduler'),
    TimelineView = require('./view.timeline');

/**
 * Module init.
 * Sets up the view for this module and binds inbound events
 * to the schedule system.  Also sets the scheduler tempo.
 *
 * @param options: View.initialize() options
 **/
function init(options) {
    console.log('Timeline init');
    new TimelineView(options).render();
    dispatcher.on('timeline:toggleplay', scheduler.togglePlay);
    dispatcher.on('timeline:trackmoved', scheduler.trackMoved);
}


/**
 * Exported module interface.
 **/
var Timeline = {
    init: init
}

module.exports = Timeline;