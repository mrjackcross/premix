// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery'),
    dispatcher = require('dispatcher');

var ResizerView = Backbone.View.extend({
    dragging: false,
    events: {
        'mousedown #contextual-content-handle': 'onHandleClicked',
        'mousemove': 'onMouseMove',
        'mouseup': 'onMouseUp'
    },
    onHandleClicked: function (e) {
        this.dragging = true;
    },
    onMouseMove: function (e) {

        dispatcher.trigger('resizer:mousemove', e);

        if (this.dragging) {

            var $mc = this.$el.find('#main-content');
            var $cc = this.$el.find('#contextual-content');
            var $footer = this.$el.find('footer');
            var $handle = this.$el.find('#contextual-content-handle');

            var dragY = $(document).height() - e.pageY + ($handle.height()/2);

            $mc.css("bottom", dragY);
            $cc.css("height", dragY - $footer.height() );

            if($cc.css("height").replace("px", "") > 400)  {
                $mc.css("bottom", 450);
                $cc.css("height", 400);
            }

            if($cc.css("height").replace("px", "") < 20) {
                $mc.css("bottom", 70);
                $cc.css("height", 20);
            }
        }

    },
    onMouseUp: function(e) {

        dispatcher.trigger('resizer:mouseup', e);

        this.dragging = false;
    }
});

module.exports = ResizerView;