var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');


var data = fs.readFileSync("./RestaurantInfo.json", "utf-8");
var restaurant = data.split("\n");

var contents = [];
var results = [];

//console.log(restaurant.length);
for(var i =0; i<restaurant.length - 1; i++){
     contents[i]= JSON.parse(restaurant[i]);
    
}

//1ere API : rechercher les noms et codepostal et récuperer les id
function getDeal(){
    console.log("In progress...");
    for(var i = 0; i<contents.length; i++){
        let search = contents[i].name;
        let postalcode = contents[i].postalcode;
        let stars = contents[i].stars;
        let locality = contents[i].locality;
        let picture = contents[i].picture;
    
    var uri = "https://m.lafourchette.com/api/restaurant-prediction?name=" + encodeURIComponent(search)

    request(uri,function(error,response,html){
        if(!error){
            const $ = cheerio.load(html);
            results = JSON.parse($.text().trim());
            //console.log(results);
            
            var idF = getIdResults(postalcode);
            //console.log(idF);

            let tab = [];
            let hasPromo = false;
            if (idF != undefined) {
                search_promo(idF, search, stars,locality,picture);
            }

        }
    });

}
}

function getIdResults(postal_code) {
    

    for (var i = 0; i< results.length; i++){
        if(results[i].address.postal_code == postal_code){
            var idResuslts = results[i].id;
            return idResuslts;
        }
    }
}




//2eme api : avec les id récuperer les promos 

function search_promo(idF,name,stars, locality, picture){
    let promo =[];
    var uri = "https://m.lafourchette.com/api/restaurant/" + idF + "/sale-type";

    request(uri,function(error,response,html){
        if(!error){
            var $ = cheerio.load(html);
            resultsSales = JSON.parse($.text().trim());
            if (idF != undefined){
                promo = addPromo(resultsSales, promo);
                if (promo.length != 0){
                    //console.log("{Id : " +idF + "\nname : "+ name + "\npromo : " + promo +"}\n");
                    restaurant = new Object();
                    restaurant.idF = idF;
                    restaurant.name = name;
                    restaurant.promo = promo;
                    restaurant.picture = picture;
                    restaurant.locality = locality;
                    restaurant.stars = stars;
                    restaurant.link = "https://www.lafourchette.com/restaurant/" + encodeURIComponent(name) +"/" +idF;
                    const doc = JSON.stringify(restaurant);
                    fs.appendFileSync("./laFourchette.json", doc + "\r\n", 'utf8', (error) => {
                        if (error) console.log(error);
                    });                   

                }
            }
        }
        
    });

}

function addPromo(resultsSales, promo) {
    
    for (var i = 0; i<resultsSales.length; i++){
        if(resultsSales[i]["exclusions"] != "" && resultsSales[i].hasOwnProperty("exclusions")&&resultsSales[i]["is_special_offer"] == true){
            promo.push(resultsSales[i]["title"].trim());
        }
    } return promo;
}

getDeal();





