// Application dependencies
var dispatcher = require('dispatcher'),
    AUDIO = require('../../common/audiocontext'),
    WaveSurfer = require('../../../lib/wavesurfer.js-master/dist/wavesurfer.min.js'),
    //WaveSurfer = require('wavesurfer.min.js'),
    PremixGlobals = require('../../common/config');


/**
 * ------------------------------------------------------
 * SampleBank
 * Handles the loading, triggering and output of the
 * drum samples in our app.
 *
 * Inbound events:
 *  - samplebank:playsample (sampleId, when)
 *      Plays a sample with an optional delay
 *  - samplebank:setfxnode (Node)
 *      Inlines a Node in the chain, clears it if null
 *
 * Outbound events:
 *  - samplebank:ready
 *      Fires when all samples loaded
 * ------------------------------------------------------
 **/


var fxNode = null,
    wavesurfers = {};

/**
 * Loads a sample via XHR and triggers a 'ready' event if
 * it's the last one to load.
 *
 * @param key: string ID to store sample as
 * @param url: string path of sample source
 **/
function loadSample(trackData) {

    var wavesurfer = WaveSurfer.create({
        audioContext: AUDIO,
        container: '#' + trackData.trackId,
        interact: false,
        fillParent: false,
        minPxPerSec: PremixGlobals.getPixelsPerSecond()
    });

    wavesurfers[trackData.trackId] = wavesurfer;

    wavesurfer.load(trackData.url);

    wavesurfer.on('ready', function () {
        dispatcher.trigger('samplebank:sampleloaded', trackData.trackId);
    });

}


/**
 * Triggers a sample to play by creating a new source node
 * and wiring it (via an FX node, if present) to the
 * browser's audio output.  Source nodes are not reusable
 * and will be GC'd by the browser.
 *
 * @param id: string ID of sample to play
 * @param when: int time (ms) after creation to play sound
 **/
function playSample(trackHitData) {

    var trackId = trackHitData.trackId;
    var playTime = trackHitData.playTime
    var offset = trackHitData.offset;

    wavesurfers[trackId].play(playTime, offset);

    //_playSampleDelayed(trackHitData);
}

// function _playSampleDelayed(trackHitData) {
//     requestAnimationFrame(function () {
//
//         if(AUDIO.currentTime >= trackHitData.playTime) {
//             wavesurfers[trackHitData.trackId].play();
//
//             console.log("latency = " + (AUDIO.currentTime - trackHitData.playTime) * 1000 + "ms");
//
//         } else {
//             _playSampleDelayed(trackHitData);
//         }
//
//     });
// }

function stopSamples() {
    for (var i in wavesurfers) {
        if (wavesurfers.hasOwnProperty(i)) {

            if(wavesurfers[i].isPlaying()) {
                wavesurfers[i].stop();
            }

        }
    }
}

function playPauseSamples() {
    for (var i in wavesurfers) {
        if (wavesurfers.hasOwnProperty(i)) {
            wavesurfers[i].pause();
        }
    }
}


/**
 * Stores a reference to a node that we will inline, if
 * present, when playing sounds via playSample().
 *
 * @param node: Node instance, or null
 **/
function setFxNode(node) {
    fxNode = node;
}


/**
 * Module init.
 * Binds inbound events and begins sample loading.
 *
 * @param srcObj: see loadSamples()
 **/
function init() {
    console.log('SampleBank init');
    dispatcher.on('samplebank:playsample', playSample);
    dispatcher.on('samplebank:stopsamples', stopSamples);
    dispatcher.on('samplebank:playpausesamples', playPauseSamples);
    dispatcher.on('samplebank:setfxnode', setFxNode);
    dispatcher.on('samplebank:loadsample', loadSample);
    dispatcher.trigger('samplebank:ready');
}


/**
 * Exported module interface
 **/
var SampleBank = {
    init: init
};

module.exports = SampleBank;