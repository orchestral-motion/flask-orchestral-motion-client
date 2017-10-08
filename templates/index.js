var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.timestamp); })
    .y(function(d) { return y(d.x); });

d3.csv("/static/data/test.csv?foo=baz", function(d) {
  d.timestamp = parseTime(d.timestamp);
  d.x = +d.x;
  d.y = +d.y;
  d.z = +d.z;
  return d;
}, function(error, data) {
  if (error) throw error;
  console.log(data);
  x.domain(d3.extent(data, function(d) { return d.timestamp; }));
  y.domain(d3.extent(data, function(d) { return d.x; }));

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
});


var ws_path =  "wss://murmuring-dawn-85833.herokuapp.com/stream/";
var table = $("#table tbody");
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

$("form#single").submit(function (e) {
    e.preventDefault();
    var x = $("#x", $(this)).val() || 1;
    var y = $("#y", $(this)).val() || 2;
    var z = $("#z", $(this)).val() || 3;
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

$("form#many").submit(function (e) {
    e.preventDefault();
    _.each(_.range(10), function(i) {
        var num = Math.floor(Math.random() * 10);
        var data = {
            x: num,
            y: num,
            z: num
        };
        console.log(data)
        webSocketBridge.stream('position').send({
            "pk": 1,
            "action": "create",
            "data": data
        });
    })
});

// Helpful debugging
webSocketBridge.socket.addEventListener('open', function() { console.log("Connected to notification socket"); });
webSocketBridge.socket.addEventListener('close', function() { console.log("Disconnected to notification socket"); });
