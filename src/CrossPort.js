class CrossPort {
    constructor (nativeWorker, useShared) {
        this._portNativeWorker = nativeWorker;
        this._useShared = useShared;
    }

    start () {
        if (this._useShared) {
            this._portNativeWorker.port.start();
        }
    };

    postMessage () {
        let nativePort = this._portNativeWorker.port;
        this._useShared ? nativePort.postMessage.apply(nativePort, arguments) :
            this._portNativeWorker.postMessage.apply(this._portNativeWorker, arguments);
    };

    close () {
        this._useShared ? this._portNativeWorker.port.close() : this._portNativeWorker.terminate();
    };

    set onmessage (cb) {
        this._useShared ? this._portNativeWorker.port.onmessage = cb : this._portNativeWorker.onmessage = cb;
    }
}
