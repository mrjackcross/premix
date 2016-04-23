// Application dependencies
var dispatcher = require('dispatcher'),
    AUDIO = require('../../common/audiocontext'),
    WaveSurfer = require('wavesurfer.js'),
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
    wavesurfers = {},
    bufferSources = {};


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
        dispatcher.trigger('samplebank:trackloaded', trackData.id);
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

    bufferSources[trackHitData.trackId] = AUDIO.createBufferSource();
    bufferSources[trackHitData.trackId].buffer = wavesurfers[trackHitData.trackId].backend.buffer;

    if (fxNode) {
        bufferSources[trackHitData.trackId].connect(fxNode);
        fxNode.connect(AUDIO.destination);
    } else {
        bufferSources[trackHitData.trackId].connect(AUDIO.destination);
    }
    bufferSources[trackHitData.trackId].start(trackHitData.playTime || 0);

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
    dispatcher.on('samplebank:setfxnode', setFxNode);
    dispatcher.on('timeline:trackadded', loadSample);
    dispatcher.trigger('samplebank:ready');
}


/**
 * Exported module interface
 **/
var SampleBank = {
    init: init
};

module.exports = SampleBank;