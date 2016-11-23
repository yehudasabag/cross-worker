
describe("CrossWorker tests:", function () {
    "use strict";

    describe("constructor tests:", function () {
        it("should create a SharedWorker if supported", function () {
            let cdWorker = new CrossWorker("base/test/dummyWorker.js");
            if (window.SharedWorker) {
                assert.isTrue(cdWorker._nativeWorker instanceof SharedWorker);
            }
            else {
                assert.isTrue(cdWorker._nativeWorker instanceof Worker);
            }
        });

        it("should create a dedicated worker always", function () {
            let cdWorker = new CrossWorker("base/test/dummyWorker.js", true);
            assert.isTrue(cdWorker._nativeWorker instanceof Worker);
        });

        it("should create a dedicated worker from a Blob", function () {
            let blobURL = URL.createObjectURL(new Blob(['(',
                function () {

                }.toString(), ')()'], {type: 'application/javascript'}));

            let cdWorker = new CrossWorker(blobURL, true);
            URL.revokeObjectURL(blobURL);
            assert.isTrue(cdWorker._nativeWorker instanceof Worker);
        });

        it("should create a SharedWorker from a Blob", function () {
            let blobURL = URL.createObjectURL(new Blob(['(',
                function () {

                }.toString(), ')()'], {type: 'application/javascript'}));

            let cdWorker = new CrossWorker(blobURL);
            URL.revokeObjectURL(blobURL);
            assert.isTrue(window.SharedWorker ? cdWorker._nativeWorker instanceof window.SharedWorker
                : cdWorker._nativeWorker instanceof window.Worker);
        });
    });

    describe("message passing tests:", function () {
        it('string messages between main to CrossWorker should pass', function (done) {
            var expectedResult = null;
            let cdWorker = new CrossWorker("base/test/dummyWorker.js");
            cdWorker.port.onmessage = function (e) {
                try {
                    assert.equal(e.data, expectedResult);
                    expectedResult = 'BBB';
                    if (e.data === 'AAA') {
                        cdWorker.port.postMessage('BBB');
                    }
                    else {
                        assert.equal(e.data, 'BBB');
                        done();
                    }

                }
                catch (ex) {
                    console.log(ex.message);
                }
            };
            expectedResult = 'AAA';
            cdWorker.port.postMessage("AAA");
        });

        it('object messages between main to CrossWorker should pass', function (done) {
            var expectedResult = null;
            let cdWorker = new CrossWorker("base/test/dummyWorker.js");
            cdWorker.port.onmessage = function (e) {
                try {
                    assert.deepEqual(e.data, expectedResult);
                    done();
                }
                catch (ex) {
                    console.log(ex.message);
                }
            };
            var data = {a: "yehuda", b: "sabag"};
            expectedResult = data;
            cdWorker.port.postMessage(data);
        });

        it('message passing with a CrossWorker created from a Blob should work', function (done) {
            let blobURL = URL.createObjectURL(new Blob(['(',
                function () {
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
                    self.onmessage = function (e) {
                        "use strict";

                        console.log("!!! onmessage worker");
                        var workerResult = e.data;
                        postMessage(workerResult);
                    }
                }.toString(), ')()'], {type: 'application/javascript'}));

            let cdWorker = new CrossWorker(blobURL);
            assert.isTrue(window.SharedWorker ? cdWorker._nativeWorker instanceof window.SharedWorker
                : cdWorker._nativeWorker instanceof window.Worker);

            let expectedResult = null;
            cdWorker.port.onmessage = function (e) {
                try {
                    assert.equal(e.data, expectedResult);
                    expectedResult = 'BBB';
                    if (e.data === 'AAA') {
                        cdWorker.port.postMessage('BBB');
                    }
                    else {
                        assert.equal(e.data, 'BBB');
                        URL.revokeObjectURL(blobURL);
                        done();
                    }

                }
                catch (ex) {
                    console.log(ex.message);
                    assert.fail();
                }
            };
            expectedResult = 'AAA';
            cdWorker.port.postMessage("AAA");

        });

        // Currently not working due to bug in Chrome http://crbug.com/334408
        xit('message passing with transferable objects should succeed', function (done) {
            let cdWorker = new CrossWorker("base/test/dummyWorker.js", true);

            let uInt8Array = new Uint8Array(1024);
            for (let i = 0; i < uInt8Array.length; ++i) {
                uInt8Array[i] = i;
            }

            cdWorker.port.onmessage = function (e) {
                let temp = e.data;
                assert.equal(temp.length, uInt8Array.length, 'length is not equal');
                for (let i = 0; i < temp.length; ++i) {
                    assert.equal(uInt8Array[i], temp[i]);
                }
                done();
            };

            cdWorker.port.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);
        });
    });

    describe('close method tests:', function () {
        it('close should close the worker', function (done) {
            let cdWorker = new CrossWorker("base/test/dummyWorker.js", true);
            cdWorker.port.onmessage = function (e) {
                assert.equal(e.data, "Before close");
                cdWorker.port.close();
                cdWorker.port.postMessage("After close");
                // If we will receive an onmessage in the meantime the test will fail since 'Before close' != 'After close'
                setTimeout(done, 200);
            };
            cdWorker.port.postMessage("Before close");

        });

    });


});
