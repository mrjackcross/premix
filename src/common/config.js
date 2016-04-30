/**
 * ------------------------------------------------------
 * By require()ing this file in different
 * parts of the app, we can pass namespaced globals around
 * ------------------------------------------------------
 **/


var PremixGlobals = {
    // Variables
    totalTime: 600.0,
    pixelsPerSecond: 10,
    lookahead: 0.100,
    nudgeAmount: 0.010,
    masterTempo: 140,
    wavesurferHeight: 50,
    studioHost: 'http://localhost',
    studioBasePath: '/api/v1/',
    studioPort: 10010,
    studioProxyPort: 8000,


    // Getter/Setters
    getTotalTime: function () {
        return this.totalTime;
    },
    getPixelsPerSecond: function () {
        return this.pixelsPerSecond;
    },
    getLookahead: function () {
        return this.lookahead;
    },
    getNudgeAmount: function() {
        return this.nudgeAmount;
    },
    getTimelineWidth: function() {
        return this.getTotalTime() * this.getPixelsPerSecond();
    },
    getMasterTempo: function() {
        return this.masterTempo;
    },
    getWavesurferHeight: function() {
        return this.wavesurferHeight
    },
    getStudioHost: function() {
        return this.studioHost;
    },
    getStudioBasePath: function() {
        return this.studioBasePath;
    },
    getStudioPort: function() {
      return this.studioPort;
    },
    getStudioProxyPort: function() {
        return this.studioProxyPort;
    },

    // Util Methods
    pixelsToTime: function (pixelVal) {
        return pixelVal / this.getPixelsPerSecond();
    },
    timeToPixels: function (timeVal) {
        return (timeVal / this.getTotalTime()) * this.getTimelineWidth();
    },
    /**
     * Given a bpm
     * returns the playback rate required
     * to sync bpm with master.
     * 1 is normal speed, 0 is stopped,
     * 2 is double speed etc.
     * @param bpm of track to sync
     */
    getSyncModifier: function (bpm) {
        return this.getMasterTempo() / bpm;
    }
};

module.exports = PremixGlobals;