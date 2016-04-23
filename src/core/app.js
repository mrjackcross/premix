// Application dependencies
var dispatcher = require('dispatcher');

// Modules
var SampleBank = require('../modules/samplebank'),
    ResizerView = require('../modules/resizer'),
    Browser = require('../modules/browser'),
    KeyControls = require('../modules/keycontrols'),
    Timeline = require('../modules/timeline');


/**
 * ------------------------------------------------------
 * Application core.  Initializes the various modules
 * and wires up events between them to create the overall
 * functionality of the app.  Note the lack of actual
 * feature-based code in this file - it's all just 'glue'
 * between the modules themselves.
 * ------------------------------------------------------
 **/

/**
 * Utility function to proxy the parameters from a triggered
 * event directly into another.  Allows us to easily 'wire up'
 * modules by creating connections from an outbound event on
 * one module to an inbound event on another, like a switchboard.
 *
 * @param eventsHash: object of event pairs to connect
 **/
function proxyEvents(eventsHash) {

    for (var triggerEvent in eventsHash) {

        var _proxy = (function(proxyEvent) {
            return function() {
                var args = Array.prototype.slice.apply(arguments);
                args.unshift(proxyEvent);
                dispatcher.trigger.apply(dispatcher, args);
            }
        })(eventsHash[triggerEvent]);

        dispatcher.on(triggerEvent, _proxy);

    }
}

/**
 * Application startup code
 **/
function launchApp() {

    // Bind some connecting events to 'wire up' our modules
    proxyEvents({
        // PatternGrid note trigger -> SampleBank play sound
        'timeline:audiohit': 'samplebank:playsample'
    });

    // Handle keypress events from KeyControls and trigger
    // the appropriate module events
    dispatcher.on('keycontrols:keypressed', function(key) {
        switch (key) {
            case 'PAUSE_RESUME':
                dispatcher.trigger('timeline:toggleplay')
                break;
            default:
                break;
        }
    });

    // Init the global view used to resize sections
    ResizerView.init({
        el: document
    });

    // Init the keyboard controls
    KeyControls.init();

    // Init the contextual browser
    Browser.init({
        el: document.getElementById('contextual-content-main')
    });

    // Init the SampleBank, passing in the paths to our samples
    var sampleSrcs = {
        'snare': 'assets/samples/snare.wav'
    };
    SampleBank.init(sampleSrcs);

    console.log('Ready');
}


/**
 * Exported application object with initialization code
 * to do setup on the SampleBank, kicking everything off
 **/
var App = {

    init: function() {

        // When the SampleBank has loaded all its samples, fire our
        // main application startup code
        dispatcher.on('timeline:ready', launchApp);
        
        Timeline.init({
            el: document.getElementById('main-content')
        });
    }
}


module.exports = App;