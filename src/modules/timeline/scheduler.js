// Library dependencies
var dispatcher = require('dispatcher');

// Application dependencies
var AUDIO = require('../../common/audiocontext'),
    PremixGlobals = require('../../common/config');

// Variables
var tracks = {};

var isPlaying,
    _initialized = false;

var startTime,
    currentTime,
    pauseStart,
    pauseDuration = 0.0;

function trackAdded(trackInfo) {

    tracks[trackInfo.trackId] = {
        trackStartTime: trackInfo.trackStartTime,
        trackLength: trackInfo.trackLength,
        $el: trackInfo.$el,
        isPlaying: false,
        played: false
    }
}

// function trackLoaded(trackId) {
//
//     var trackLength = PremixGlobals.pixelsToTime(tracks[trackId].$el.find('wave').width());
//
//     tracks[trackId].trackLength = trackLength;
// }

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

    if(tracks[trackInfo.trackId].isPlaying) {
        stop();
        play();
    }

}

/**
 * Fires events to the dispatcher if the current step in
 * the grid has any notes to be played.
 *
 * @param pt: calculated time offset to delay the audio by
 **/
function playAudioAtTime(trackId, pt, offset) {


    var trackHitData = {
        trackId: trackId,
        playTime: pt,
        offset: offset
    }
    dispatcher.trigger('timeline:audiohit', trackHitData);

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

    for (var key in tracks) {
        if (!tracks.hasOwnProperty(key)) continue;
        tracks[key].isPlaying = false;
    }

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
    currentTime = AUDIO.currentTime - startTime - pauseDuration;

    for (var key in tracks) {
        if (!tracks.hasOwnProperty(key)) continue;
        var track = tracks[key];

        if (track.trackStartTime < currentTime + PremixGlobals.getLookahead()) {
            if(!track.played) {
                var pt = track.trackStartTime + startTime;
                playAudioAtTime(key, pt, 0);
                track.played = true;
            }
        }
        if(currentTime > track.trackStartTime && currentTime < (track.trackStartTime + track.trackLength)){
            if(!track.isPlaying) {
                var offset = currentTime - track.trackStartTime;
                playAudioAtTime(key, currentTime, offset);
                track.isPlaying = true;
            }
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
    // trackLoaded: trackLoaded,
    trackMoved: trackMoved,
    play: play,
    togglePlay: togglePlay,
    stop: stop,
    reset: reset
};

module.exports = api;
