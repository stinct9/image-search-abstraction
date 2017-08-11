// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var requestExt = require('request');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  console.log(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

var searchTerms = [];

app.get("/api/imagesearch/:data", function (request, response) {
  var data = request.params.data;
  var query = request.query.offset;
  //var query = request.params.query;
  
  console.log(data + "\noffset="+query);
  var temp = {
    searchTerm : data,
    offset : query
  };
  
  var searchDetail = {
        term : data,
        when : new Date()
  };
  
  //console.log("Details are" + JSON.stringify(searchDetail));
  
  
  
  requestExt('https://www.googleapis.com/customsearch/v1?q='+data+'&cx=008558934593121416190:j0b0axdziue&key=AIzaSyAXQT-HiBehNNVf_ffB4ZLOcjo5aE659Rs&searchType=image', function(err, res, body) {
  if (err) throw err;
    var parsedResponse = [];
    var imageResponse = [];
    
    var parse = JSON.parse(body);
    
    //console.log(body[]);
    console.log("parse: "+parse.items[0].image.thumbnailLink);
    
    for (var i = 0; i < parse.items.length; i++) {
      
      var imageResponse = {
        
        url : parse.items[i].link,
        snippet : parse.items[i].snippet,
        thubnail : parse.items[i].image.thumbnailLink,
        context : parse.items[i].image.contextLink      
      
      };
      
      console.log(imageResponse);
      parsedResponse.push(imageResponse);
      
    };
    
    
  searchTerms.push(searchDetail);
    
  response.send(JSON.stringify(parsedResponse));
});
  
  
});

app.get("/api/latest/imagesearch/", function (request, response) {
  response.send(JSON.stringify(searchTerms));
  
  console.log(JSON.stringify(searchTerms));
  
});



