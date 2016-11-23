"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CrossPort = function () {
    function CrossPort(nativeWorker, useShared) {
        _classCallCheck(this, CrossPort);

        this._portNativeWorker = nativeWorker;
        this._useShared = useShared;
    }

    _createClass(CrossPort, [{
        key: "start",
        value: function start() {
            if (this._useShared) {
                this._portNativeWorker.port.start();
            }
        }
    }, {
        key: "postMessage",
        value: function postMessage() {
            var nativePort = this._portNativeWorker.port;
            this._useShared ? nativePort.postMessage.apply(nativePort, arguments) : this._portNativeWorker.postMessage.apply(this._portNativeWorker, arguments);
        }
    }, {
        key: "close",
        value: function close() {
            this._useShared ? this._portNativeWorker.port.close() : this._portNativeWorker.terminate();
        }
    }, {
        key: "onmessage",
        set: function set(cb) {
            this._useShared ? this._portNativeWorker.port.onmessage = cb : this._portNativeWorker.onmessage = cb;
        }
    }]);

    return CrossPort;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CrossWorker = function () {
    function CrossWorker(jsFile, useDedicatedWorker) {
        _classCallCheck(this, CrossWorker);

        this._useShared = !!(!useDedicatedWorker && window.SharedWorker);
        var nativeCtor = this._useShared ? window.SharedWorker : window.Worker;
        this._nativeWorker = new nativeCtor(jsFile);
        this._cdPort = new CrossPort(this._nativeWorker, this._useShared);
    }

    _createClass(CrossWorker, [{
        key: "port",
        get: function get() {
            return this._cdPort;
        }
    }]);

    return CrossWorker;
}();
