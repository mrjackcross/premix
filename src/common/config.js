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
    wavesurferHeight: 70,

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
    getWavesurferHeight: function() {
        return this.wavesurferHeight;
    },

    // Util Methods
    pixelsToTime: function (pixelVal) {
        return pixelVal / this.getPixelsPerSecond();
    },
    timeToPixels: function (timeVal) {
        return (timeVal / this.getTotalTime()) * this.getTimelineWidth();
    }
};

module.exports = PremixGlobals;