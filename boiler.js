var socket = new WebSocket('ws://192.168.79.108/events');
var relay_status = 0; /* off */

function connect() {
  document.getElementById("status_msg").innerHTML = "<span class=\"info\">Connecting to <pre>" + socket.url + "...</pre></span>";
}

socket.onopen = function () {
  document.getElementById("relay_btn").disabled = true;
    // Send authentication message
    this.send(
        JSON.stringify(
            {
                User: 'olimex',
                Password: 'olimex'
            }
        )
    );
}

socket.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    try {
      // Print received messages in current document
      if ( msg.EventURL == "/relay" ) {
        relay_status = msg.EventData.Data.Relay;
        if ( msg.EventData.Data.Relay == 0 )
          document.getElementById("relay_btn").value = "Switch ON";
        else
          document.getElementById("relay_btn").value = "Switch OFF";
      }
      else
      if ( msg.Status == "Authorization success" ) {
        document.getElementById("status_msg").innerHTML = "<span class=\"info\">Connected to <pre>" + socket.url + ".</pre></span>";
        document.getElementById("relay_btn").disabled = false;
        get_relay();
      }
      else
      {
        document.getElementById("status_msg").innerHTML = "<span class=\"info\">Received: " + event.data + "</span>";
        document.getElementById("relay_btn").disabled = true;
      }
    } catch (e) {
        // Print errors in console
        console.log(e.message);
    }
};

socket.onerror = function (event) {
    document.getElementById("status_msg").innerHTML = "<span class=\"error\">Cannot connect to <pre>" + socket.url + "!</pre></span>";
    document.getElementById("relay_btn").disabled = true;
    console.log("WebSocket ERROR");
};

socket.onclose = function (event) {
    console.log(event.code+': '+(event.reason ? event.reason : 'WebSocket error'));
};

function get_relay() {
  setTimeout(
    function () {
      socket.send(
        JSON.stringify(
          {
            URL: '/relay',
            method: 'GET'
          }
        )
      );
    },
    100
  );
}

function switch_relay(relay) {
  var new_rel = relay_status > 0 ? 0 : 1;
  setTimeout(
    function () {
      socket.send(
        JSON.stringify(
          {
            URL: '/relay',
            Method: 'POST',
            Data: {
                Relay: new_rel
            }
          }
        )
      );
    },
    100
  );
  get_relay();
}
