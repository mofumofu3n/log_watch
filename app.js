
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socketIO = require('socket.io')
  , fs = require('fs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// --------------------------------------------
// variable
// --------------------------------------------

var host = '192.168.1.5';
var port = "3000";
var log_file = '/Applications/MAMP/logs/apache_error.log';


//app.get('/', routes.index);
app.get('/', function(req, res){
  res.render('index', {
    title: 'Log Watch',
    host: host,
    port:   port
  });
});
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketIO.listen(server);

fs.open(log_file, "r", "0644", function(err,fd){
  if(err){throw err;}

  fs.watchFile(log_file, {interval:1000}, function(cur, prev){
  if(cur.size !== prev.size){
    var buf_size = 1024;

    for(var pos=prev.size; pos < cur.size; pos+=buf_size){
      if(err){throw err;}
      
      var buf = new Buffer(buf_size);
      fs.read(fd, buf, 0, buf_size, pos,
        function(err, bytesRead, buffer){
          var log = buffer.toString('utf8', 0, bytesRead);
          io.sockets.emit('change', log);
        }
      );
    }
  }
  });
}); 
