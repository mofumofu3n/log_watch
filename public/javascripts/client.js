  var socket = io.connect('http://'+host+':'+port);

  socket.on('connect', function() {
    console.log('connect');
  });

  socket.on('disconnect', function() {
    console.log('disconnect');
  });

  socket.on('change', function(log) {
    console.log('change:' + log);
    $('#log').append(log);
  });
