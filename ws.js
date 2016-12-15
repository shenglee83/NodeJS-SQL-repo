var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 4080;
 
app.use(function (req, res) {
  res.send({ msg: "hello" });
});
 
wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);

  ws.on('message', function (message) {
    console.log('received: %s', message);
  });
 
  ws.send('something from server 192.168.0.252:4080');
});
 
server.on('request', app);
server.listen({port: port, host: '192.168.0.252' }, function (
  ) { console.log('Listening on ' + server.address().port) });