(function (exports) {
    "use strict";

    /**
     * A pollyfill for unsupported mode. It is not a full pollyfill since it does not support Object as a value and more,
     * but enough for our needs...
     * @constructor
     */
    function CDSet() {
        this._set = [];
    }

    CDSet.prototype.add = function (val) {
        this._set.push(val);
        return this; //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add
    };

    CDSet.prototype.delete = function (val) {
        for (let i = 0; i < this._set.length; i++) {
            if (this._set[i] === val) {
                this._set.splice(i, 1);
                return true; //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete
            }
        }
        return false;
    };

    CDSet.prototype.forEach = function (cb) {
        for (let i = 0; i < this._set.length; i++) {
            cb(this._set[i]);
        }
    };

    exports.Set = self.Set || CDSet; // use the default (and better) set implementation and not this naive one

})(self);