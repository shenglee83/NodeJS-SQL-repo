var WebSocket = require('ws')
  , ws = new WebSocket('ws://localhost:4080');
ws.on('open', function() {
    ws.send('something from client');
});
ws.on('message', function(message) {
    console.log('received: %s', message);
});