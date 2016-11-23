// This is for the shared worker
self.addEventListener('connect', function (e) {
    console.log("!!! onconnect");
    var port = e.ports[0];

    port.onmessage = function(e) {
        console.log("!!! onmessage");
        var workerResult = e.data;
        port.postMessage(workerResult);
    };
    port.start();
});

// This is for the regular worker (IE for now...)
onmessage = function (e) {
    "use strict";

    console.log("!!! onmessage worker");
    var workerResult = e.data;
    postMessage(workerResult);
};