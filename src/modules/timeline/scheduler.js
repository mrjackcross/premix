// Library dependencies
var dispatcher = require('dispatcher');

// Application dependencies
var AUDIO = require('../../common/audiocontext'),
    PremixGlobals = require('../../common/config');

var startTime = 0;
var isPlaying = false;
var tracks = {};


function trackAdded(trackInfo) {
    tracks[trackInfo.trackId] = {
        trackStartTime: PremixGlobals.pixelsToTime(trackInfo.xPos),
        played: false
    }
}

/**
 * Gets triggered when a track moves on the timeline
 *
 * @param trackInfo: info about the track that just moved
 **/
function trackMoved(trackInfo) {
    tracks[trackInfo.trackId].trackStartTime = PremixGlobals.pixelsToTime(trackInfo.xPos);
}

/**
 * Fires events to the dispatcher if the current step in
 * the grid has any notes to be played.
 *
 * @param pt: calculated time offset to delay the audio by
 **/
function playAudioAtTime(trackId, pt) {
    if(!tracks[trackId].played) {

        var trackHitData = {
            trackId: trackId,
            playTime: pt
        }
        dispatcher.trigger('timeline:audiohit', trackHitData);

        tracks[trackId].played = true;
    }
}

/**
 * Plays the current pattern from the beginning.
 **/
function play() {
    isPlaying = true;
    startTime = AUDIO.currentTime + 0.005;
    scheduleAudio();
}


/**
 * Stops playing.
 **/
function stop() {
    isPlaying = false;

    for (var key in tracks) {
        if (!tracks.hasOwnProperty(key)) continue;
        tracks[key].played = false;
    }

    dispatcher.trigger('timeline:stepchanged', 0.0);
}


/**
 * Toggles playing on or off depending on current state.
 **/
function togglePlay() {
    var fn = (isPlaying) ? stop : play;
    fn();
}

/**
 * Calculates the precise time of the next
 * note in the sequence and triggers it. This
 * method loops constantly once triggered - think
 * of it as like a requestAnimationFrame() for
 * note scheduling.
 **/
function scheduleAudio() {
    if (!isPlaying) return false;
    var currentTime = AUDIO.currentTime;
    currentTime -= startTime;

    for (var key in tracks) {
        if (!tracks.hasOwnProperty(key)) continue;
        var track = tracks[key];

        if (track.trackStartTime < currentTime + PremixGlobals.getLookahead()) {
            var pt = track.trackStartTime + startTime;
            playAudioAtTime(key, pt);
        }

    }

    advanceStep(currentTime);
    ti = requestAnimationFrame(scheduleAudio);
}

/**
 * Advances the scheduler to the next step in the pattern,
 * looping back to the start if needed.
 **/
function advanceStep(currentTime) {
    if (currentTime >= 10.0) {
        played = false;
        startTime = AUDIO.currentTime;
    }
    dispatcher.trigger('timeline:stepchanged', currentTime);
}

/**
 * Exported interface for the scheduler.  Since we only
 * use it within the PatternGrid module, it's fine to
 * expose a more comprehensive interface for the rest of
 * the module to work with directly.
 **/
var api = {
    trackAdded: trackAdded,
    trackMoved: trackMoved,
    play: play,
    togglePlay: togglePlay,
    stop: stop
};

module.exports = api;
