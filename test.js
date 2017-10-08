const WebSocket = require('ws');

const path = "wss://murmuring-dawn-85833.herokuapp.com/stream/";
const ws = new WebSocket(path);


ws.on('open', function open() {
  console.log("Connection made");
  var data = {
      x: 9,
      y: 9,
      z: 9
  };
  payload = {
      "pk": 1,
      "action": "create",
      "data": data
  };
  const msg = {
    stream: "position",
    payload: payload
  }
  ws.send(JSON.stringify(msg));
});
