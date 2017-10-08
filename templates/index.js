var ws_path =  "wss://murmuring-dawn-85833.herokuapp.com/stream/";
var table = $("#table tbody");
var form = $("form");
var template = _.template($("#table-row-template").html());
console.log("Connecting to " + ws_path);
var webSocketBridge = new channels.WebSocketBridge();
webSocketBridge.connect(ws_path);
webSocketBridge.listen();
webSocketBridge.demultiplex('position', function(payload, streamName) {
    console.log(payload);
    // Handle different actions
    if (payload.action == "create") {
        var tr = template({ obj: payload.data });
        table.prepend(tr);
    }
});
form.submit(function (e) {
    e.preventDefault();
    var x = $("#x", form).val() || 1;
    var y = $("#y", form).val() || 2;
    var z = $("#z", form).val() || 3;
    var data = {
        x: x,
        y: y,
        z: z
    };
    webSocketBridge.stream('position').send({
        "pk": 1,
        "action": "create",
        "data": data
    });
});
// Helpful debugging
webSocketBridge.socket.addEventListener('open', function() { console.log("Connected to notification socket"); });
webSocketBridge.socket.addEventListener('close', function() { console.log("Disconnected to notification socket"); });
