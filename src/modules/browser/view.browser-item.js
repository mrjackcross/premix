// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var _template = require('./browser-item.hbs');

var BrowserItemView = Backbone.View.extend({
    events: {
    },
    model: null,
    $browserItem: null,
    initialize: function (options) {
        this.model = options.model;
    },
    render: function () {

        var rawHTML = _template({
            model: this.model
        });

        this.$el.append(rawHTML);

        this.$browserItem = this.$el.find("#browser-item-" + this.model.attributes.trackId);

        this.$browserItem.attr("draggable", "true");
        this.$browserItem.bind("dragstart", _.bind(this._dragStartEvent, this));

        // Fetch will go here
        return this;
    },
    _dragStartEvent: function (e) {
        var data
        if (e.originalEvent) e = e.originalEvent;
        e.dataTransfer.effectAllowed = "copy"; // default to copy
        data = this.dragStart(e.dataTransfer, e);

        window._backboneDragDropObject = null;
        if (data !== undefined) {
            window._backboneDragDropObject = data;// we cant bind an object directly because it has to be a string, json just won't do
        }
    },

    dragStart: function (dataTransfer, e) {
        return this.model.attributes;
    } // override me, return data to be bound to drag

});

module.exports = BrowserItemView;