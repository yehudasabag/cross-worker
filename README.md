[![Build Status](https://travis-ci.org/yehudasabag/cross-worker.svg?branch=master)](https://travis-ci.org/yehudasabag/cross-worker)

# cross-worker
A small library which provides a wrapper around the SharedWorker object which falls back to work as dedicated Worker in browsers that do not support SharedWorker (IE, Edge and more)

# usage
You can download the minified library version from https://raw.githubusercontent.com/yehudasabag/cross-worker/master/lib/cross-worker.min.js. The non-minified from https://raw.githubusercontent.com/yehudasabag/cross-worker/master/lib/cross-worker.js.

Add the library to your page. The api is identical to the regular api of [SharedWorker](https://developer.mozilla.org/en/docs/Web/API/SharedWorker) even when the library falls back to a dedicated Worker. Just instead of initializing a SharedWorker using ```new SharedWorker()``` use ```new CrossWorker()```.
Here is an example:
```
let crossWorker = new CrossWorker("[path to your worker file]");
crossWorker.port.onmessage = (e) => {
    let msg = e.data;
    ...
    crossWorker.port.postMessage('Thanks');
}
```

# build
Clone the repository, npm install, npm run build.
The build will execute babel to generate a single cross-worker.js file in the lib folder and then will minify it to cross-worker.min.js
