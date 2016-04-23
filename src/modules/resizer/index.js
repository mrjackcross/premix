// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var ResizerView = require('./view.resizer');

/**
 * Module init.
 * @param options: View.initialize() options
 **/
function init(options) {
    console.log('Resizer init');
    new ResizerView(options).render();
}


/**
 * Exported module interface.
 **/
var Resizer = {
    init: init
}

module.exports = Resizer;