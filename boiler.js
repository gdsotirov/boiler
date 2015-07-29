
var socket = new WebSocket('ws://192.168.79.105/events');
var relay_status = 0; /* off */

function connect() {
  document.getElementById("status_msg").innerHTML = "<span class=\"info\">Connecting to <pre>" + socket.url + "...</pre></span>";
}

socket.onopen = function () {
    document.getElementById("status_msg").innerHTML = "<span class=\"info\">Connected to <pre>" + socket.url + ".</pre></span>";
    document.getElementById("relay_btn").disabled = false;
    // Send authentication message
    this.send(
        JSON.stringify(
            {
                User: 'olimex',
                Password: 'olimex'
            }
        )
    );

    // Send request for Devices and URL Entry Points
    setTimeout(
        function () {
            socket.send(
                JSON.stringify(
                    {
                        URL: '/',
                        Method: 'GET'
                    }
                )
            );
        },
        100
    );
}

socket.onmessage = function (event) {
    try {
        // Print received messages in current document
        document.write('<pre>'+JSON.stringify(JSON.parse(event.data), null, 4)+'</pre>');
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

function get_relay(relay) {
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

  relay_status
}

function switch_relay(relay) {
  document.getElementById("status_msg").innerHTML = "<span class=\"info\">Switching on/off.</span>";
  setTimeout(
    function () {
      socket.send(
        JSON.stringify(
          {
            URL: '/relay',
            Method: 'POST',
            Data: {
                Relay: 1
            }
          }
        )
      );
    },
    100
  );
}
