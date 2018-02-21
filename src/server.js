var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();



    request ({
        uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
    }, function(error, response, body) {
        var $ = cheerio.load(body);

        //if file exists delete the content
        if(fs.existsSync('links.txt')) {
            fs.truncate('links.txt', 0, function(){
            
            })
        }
    

    var pages = 36;
    for(i =1; i < pages; i ++){

    
    request({
        uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-" +i,
    }, function (error, response, body) {
         
            var $ = cheerio.load(body);
            $('.poi-card-link').each(function(index){
                var link = $(this);
                //console.log(link);
                var restau_link = "https://restaurant.michelin.fr" + link.attr('href');
                try{
                    fs.appendFile("links.txt", restau_link + "\n");
                } catch(err){
                    console.log(err);
                }
            });

        }).on('error', function(err){
            console.log(err)
        }).end()

        }
    }).on('error', function(err) {
        console.log(err)
    }).end();



//app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;