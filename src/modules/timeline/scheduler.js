// Library dependencies
var dispatcher = require('dispatcher');

// Application dependencies
var AUDIO = require('../../common/audiocontext'),
    PremixGlobals = require('../../common/config');

var startTime = 0.0;
var isPlaying = false;
var tracks = {};
var pauseStart = 0.0;
var pauseDuration = 0.0;
var _initialized = false;


function trackAdded(trackInfo) {
    tracks[trackInfo.trackId] = {
        trackStartTime: trackInfo.trackStartTime,
        played: false
    }
}

/**
 * Gets triggered when a track moves on the timeline
 * Alters the track's start time and sets it's played
 * flag to false if it's moved past the playhead
 *
 * @param trackInfo: info about the track that just moved
 **/
function trackMoved(trackInfo) {
    var newTrackStartTime = PremixGlobals.pixelsToTime(trackInfo.xPos);

      tracks[trackInfo.trackId].trackStartTime = newTrackStartTime;

    if(newTrackStartTime > currentTime) {
        tracks[trackInfo.trackId].played = false;
    }
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

    if(!_initialized) {
        startTime = AUDIO.currentTime;
        _initialized = true;
    } else {
        pauseDuration += (AUDIO.currentTime - pauseStart);
    }

    scheduleAudio();
}


/**
 * Stops playing.
 **/
function stop() {
    isPlaying = false;
    pauseStart = AUDIO.currentTime;
    dispatcher.trigger('timeline:paused');

}

function reset() {

    startTime = 0.0;
    pauseStart = 0.0;
    pauseDuration = 0.0;
    _initialized = false;
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
    currentTime -= pauseDuration;

    for (var key in tracks) {
        if (!tracks.hasOwnProperty(key)) continue;
        var track = tracks[key];

        if (track.trackStartTime < currentTime + PremixGlobals.getLookahead()) {
            var pt = track.trackStartTime + startTime;
            playAudioAtTime(key, pt);
        }
    }
    advanceStep(currentTime);
    requestAnimationFrame(scheduleAudio);
}

/**
 * Advances the scheduler to the next step in the pattern,
 * looping back to the start if needed.
 **/
function advanceStep(currentTime) {
    if (currentTime >= PremixGlobals.getTotalTime()) {
        reset();
        play();
        dispatcher.trigger('timeline:looped');
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
    stop: stop,
    reset: reset
};

module.exports = api;
