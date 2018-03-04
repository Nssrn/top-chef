
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var express = require('express');
var app = express();


function get_info(uri, callback) {
  request(uri, function(error, response, body){
    if(!error) {

    const $ = cheerio.load(body);
    var restaurant = new Object();
    restaurant.name = $('.poi_intro-display-title').text().trim();
    restaurant.stars = $('#node_poi-guide-wrapper > div.node_poi-distinction-section > ul > li:nth-child(1) > div.content-wrapper').text();
    restaurant.thoroughfare = $('.poi_intro-display-address .field__item .thoroughfare').text();
    restaurant.postalcode = $('.poi_intro-display-address .field__item .postal-code').text();
    restaurant.locality = $('.poi_intro-display-address .field__item .locality').text();
    restaurant.picture = $(".landscape").attr("data-src");
    restaurant.link = uri; 

    callback(restaurant);
  }

  });
}

function get_links(uri, callback){
  var links = [];
  request(uri, function(error, reponse, body){
    if(!error) {
      const $ = cheerio.load(body);
      $('.poi-card-link').each(function(index, element){
        links.push("https://restaurant.michelin.fr" + $(element).attr('href'));
    });
    callback(links);
  }
  });

}

function scrape(uri){
  //var json = { "restaurants" : []};
  var pages = 36;
  for (var i = 1; i < pages; i++){
    get_links(uri + '/page-' + i, function(arr) {
      arr.forEach(function(element) {
        get_info(element, function(restaurant){
          const doc = JSON.stringify(restaurant);
          fs.appendFileSync("./RestaurantInfo.json", doc + "\r\n", 'utf8', function(error){
            if (!error){
              console.log('Restaurant added succesufully');
            }
            else {return console.log(error)};
          });
        }); 
      });
    });
  }
}


function get(){
  if (!fs.existsSync('./RestaurantInfo.json')){
    scrape("https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin");
    return console.log('In progress...');
    }
    var content = fs.readFileSync('./RestaurantInfo.json', 'utf-8');
    return JSON.parse(content);

}

get();


