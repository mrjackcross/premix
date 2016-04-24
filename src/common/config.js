/**
 * ------------------------------------------------------
 * By require()ing this file in different
 * parts of the app, we can pass namespaced globals around
 * ------------------------------------------------------
 **/


var PremixGlobals = {
    totalTime: 10.0,
    pixelsPerSecond: 200,
    lookahead: 0.100,
    getTotalTime: function () {
        return this.totalTime;
    },
    getPixelsPerSecond: function () {
        return this.pixelsPerSecond;
    },
    getLookahead: function () {
      return this.lookahead;
    },
    getTimelineWidth: function() {
        return this.getTotalTime() * this.getPixelsPerSecond();
    },
    pixelsToTime: function (pixelVal) {
        return pixelVal / this.getPixelsPerSecond();
    },
    timeToPixels: function (timeVal) {
        return (timeVal / this.getTotalTime()) * this.getTimelineWidth();
    }
};

module.exports = PremixGlobals;