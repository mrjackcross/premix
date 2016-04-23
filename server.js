var express = require('express');
var app = express();

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/styles'));
app.use('/assets', express.static(__dirname + '/assets'));


app.get('/', function(req, res){
    res.render('index.ejs');
});

app.listen(3000);
console.log('Listening on port 3000');