var WebSocket = require('ws')
  , ws = new WebSocket('ws://192.168.0.206:8000');
ws.on('open', function() {
    ws.send('something from client');
});
ws.on('message', function(message) {
    console.log('received: %s', message);
});