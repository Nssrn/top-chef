var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');


//1ere API : rechercher les noms et codepostal et récuperer les id
function search_id(){
    var uri = "https://m.lafourchette.com/api/restaurant-prediction?name=LeRadio";
    request(uri,function(error,response,html){
        if(!error){
            var $ = cheerio.load(html);
            const element =$('body');
            var test = element.text();
            var objectValue = JSON.parse(test);

            console.log(objectValue[0].id);
        }
    });

}
//search_id();

//2eme api : avec les id récuperer les promos 

function search_promo(){
    var uri = "https://m.lafourchette.com/api/restaurant/78372/sale-type";

    request(uri,function(error,response,html){
        if(!error){
            var $ = cheerio.load(html);
           
                const element =$('body');
                var test = element.text();
                var objectValue = JSON.parse(test);

               for (var i = 0; i < objectValue.length; i++){
                   if (objectValue[i].is_special_offer == true){
                    console.log(objectValue[i].title);

                   }
                
               }

        }
    });

}


search_promo();


