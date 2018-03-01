var express = require('express');
var app = express();
var michelin = require('./michelin');

var json = michelin.get();
app.get('/restau_list', function(req,res){
    res.send(json);
    
})


//app.listen('8081')
//console.log('Magic happens on port 8081');
exports = module.exports = app;