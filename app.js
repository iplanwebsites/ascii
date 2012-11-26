
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
//, mongoose = require('mongoose');
var ejs = require("ejs");
 //mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/mongo_test");

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});




//var app = express.createServer();








// Routes

app.get('/show', function(req, res){
  res.render('show.ejs', {foo: 'data'}, function (err, templ) {
       console.log('Render result:');
       //console.log(result2);
       res.send(templ); // send rendered HTML back to client
     });
  
   
});


app.get('/', function(req, res){
  res.render('watch.ejs', {foo: 'data'}, function (err, templ) {
       console.log('Render result:');
       //console.log(result2);
       
       res.send(templ); // send rendered HTML back to client
     });
  
   
});




var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var everyone = require("now").initialize(server);
everyone.now.logStuff = function(msg){
    console.log(msg);
}



everyone.now.showFrame = function(str, channel){
  console.log(channel);
  everyone.now.receiveMessage(str);
  //todo: send this to ALL viewers of this channel
}
/*
io.configure(function () {
  io.set('transports', ['xhr-polling']);
  io.set("polling duration", 10); 
});*/

