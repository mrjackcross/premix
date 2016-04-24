

    

// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var BrowserView = require('./view.browser');

/**
 * Module init.
 * @param options: View.initialize() options
 **/
function init(options) {
    console.log('Browser init');

    new BrowserView(options).render();
}


/**
 * Exported module interface.
 **/
var Browser = {
    init: init
}

module.exports = Browser;