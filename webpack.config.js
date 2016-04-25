var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + "/public",
        filename: "main.js"
    },
    devtool: "source-map",
    module: {
        loaders: [
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' },
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    },
    plugins : [ new webpack.ProvidePlugin({
        $ : "jquery",
        Backbone : "backbone",
        _ : "underscore"
    }) ]
};