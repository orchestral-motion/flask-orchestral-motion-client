var ws_path =  "wss://murmuring-dawn-85833.herokuapp.com/stream/";
var ul = $("#events ul");
console.log("Connecting to " + ws_path);
console.log("Writing to " + ul);
var webSocketBridge = new channels.WebSocketBridge();
webSocketBridge.connect(ws_path);
webSocketBridge.listen();
webSocketBridge.demultiplex('position', function(payload, streamName) {
    console.log(payload);
    // Handle different actions
    if (payload.action == "create") {
        var li = "<li>" + payload.data.timestamp + "</li>"
        ul.append(li);
    }
});
$("button").click(function () {
    console.log("Create!");
    webSocketBridge.stream('position').send({
        "pk": 1,
        "action": "create",
        "data": {
            "x": 1,
            "y": 2,
            "z": 3
        }
    });
});
// Helpful debugging
webSocketBridge.socket.addEventListener('open', function() { console.log("Connected to notification socket"); });
webSocketBridge.socket.addEventListener('close', function() { console.log("Disconnected to notification socket"); });
