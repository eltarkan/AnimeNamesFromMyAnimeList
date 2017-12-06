var osmosis = require('osmosis');
var fs = require('fs');
var sql = require('mysql');
var replaceall = require("replaceall");

var animes = [];
var test = [];
var counter = 0;

var con = sql.createConnection({
    host: "localhost",
    database: "top_animes",    
    user: "root",
    password: ""
    
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected!!!!");
});


function scrapIt(url) {
    
osmosis
.get(url)
.find('.ranking-list')
.set({
    Sira: 'span',
    Adi: '.detail a',
    Bilgiler: '.information',
    Puani: '.score span',
    Link: '.detail @href'

})
.data(function(data){
    
    Display(data);
});

}

function Display(content){
    test = content;
    test.Adi = replaceall("'", "/", test.Adi);
    test.Link = replaceall("'", "/", test.Link);
    var sql = "INSERT INTO animeler (ad) VALUES ('" + test +"')";
    var sql = "INSERT INTO animeler (sira, ad, puan, link) VALUES ('" + test.Sira + "', '" + test.Adi + "', '" + test.Puani + "', '" + test.Link + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted " + counter);
    });
}

function MagicHappensHere() {
    var dex = 0;    
    while(dex < 15000){
        counter = dex;
        url = 'https://myanimelist.net/topanime.php' + '?limit=' + dex;    
        scrapIt(url);
        dex = dex + 50;
        
    }
    url = 'https://myanimelist.net/topanime.php';
    scrapIt(url);
    
}

MagicHappensHere();

