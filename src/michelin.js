
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

if (fs.existsSync('./restau_list.json')){
  fs.truncate('restau_list.json', 0, function(){
  })
}

var Reader = require('readline').createInterface({
  input: require('fs').createReadStream('./links.txt')
});

Reader.on('line', function(line){
  request({
    uri: line,
  }, function(error, response, body) {
    if(error) return console.log(error);
    
    var $ = cheerio.load(body);
    var restaurant = {};
    restaurant['name'] = $('.poi_intro-display-title').text().trim();

    var thoroughfare = $('.poi_intro-display-address .field__item .thoroughfare').text();
    var postalcode = $('.poi_intro-display-address .field__item .postal-code').text();
    var locality = $('.poi_intro-display-address .field__item .locality').text();
    var address = {};
    address['thoroughfare'] = thoroughfare;
    address['postalcode'] = postalcode;
    address['locality'] = locality;
    restaurant['address'] =  address;

    
    try{
      fs.appendFileSync("restau_list.json",JSON.stringify(restaurant) + "\n");
    }catch(err){
      console.log(err)
    }

  }).on('error', function(err){console.log(err)}
).end()
});