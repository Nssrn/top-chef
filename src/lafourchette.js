var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

let separators = ['\'','','-'];
let regExp = new RegExp('[' + separators.join('')+']','g')

var Reader = require('readline').createInterface({
    input: require('fs').createReadStream('./restau_list.json')
});

Reader.on('line', function(line) {
    var search = JSON.parse(line);
    var name = encodeURIComponent(search["name"])

    request({
        uri:"https://m.lafourchette.com/api/restaurant-prediction?name="+name,
    }, function(error, response, body){
        var $ = cheerio.load(body);
        var result = JSON.parse(body);
        var restau_result = result['data']['restaurants'];

        for(var i=0; i<restau_result.length; i++){
            if(restau_result[i]['zipcode']== search['address']['postalcode']){
                let matching_restau = restau_result[i]
                let tokensSearch = matching_restau["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
                var searchLinkParameters = "";
                for (var i=0; i<tokensSearch.length -1; i++){
                    searchLinkParameters += tokensSearch[i] + '-';
                }
                searchLinkParameters += tokensSearch[tokensSearch.length-1];

                request({
                    uri:"https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + matching_restau['id_restaurant'],
                }, function(error, response, body){
                    if(error) return console.log(error);

                    var $$ = cheerio.load(body);
                    //scrapper les promo 
                    var restaurant = {};
                    restaurant['name'] = matching_restau['name']
                    var address = {};
                    restaurants['zipcode'] = matching_restau['zipcode']
                    restaurant['event'] = $$('.saleType.saleType--event .saleType-title').text();
                    restaurant['specialOffer'] = $$('.saleType.saleType--specialOffer .saleType-title').text();

                    try{
                        fs.appendFileSync("promo_lafourchette.json", JSON.stringify(restaurant)+"\n");
                    }catch(err){console.log(err);}
                }).on('error',function(err){
                    console.log(err);
                }).end();

                }
            }
        }).on('error',function(err){
            console.log(err);
        }).end();
    
    });
