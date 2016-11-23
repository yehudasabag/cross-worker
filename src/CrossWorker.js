class CrossWorker {
    constructor(jsFile, useDedicatedWorker) {
        this._useShared = !!(!useDedicatedWorker && window.SharedWorker);
        let nativeCtor = this._useShared ? window.SharedWorker : window.Worker;
        this._nativeWorker = new nativeCtor(jsFile);
        this._cdPort = new CrossPort(this._nativeWorker, this._useShared);
    }
    get port() {
        return this._cdPort;
    }
}
