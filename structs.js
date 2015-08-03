var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var structs;
(function (structs) {
    var uidCount = 0;
    function uid(what) {
        if (typeof what === 'object') {
            if (typeof what.__structs_uid__ !== 'string') {
                var uid = 'o' + uidCount++;
                try {
                    Object.defineProperty(what, '__structs_uid__', {
                        value: uid,
                        enumerable: false,
                        writable: false,
                        configurable: false
                    });
                }
                catch (e) {
                    // We've encountered an error -- probably because we're in a
                    // browser that doesn't support Object.defineProperty.  In
                    // this case, we'll add the property to the object directly,
                    // which, however, is avowedly not very desirable since
                    // the property thus becomes enumerable.
                    what['__structs_uid__'] = uid;
                }
            }
            return what['__structs_uid__'];
        }
        return 's' + what;
    }
    var WeakMap = (function () {
        function WeakMap(iterable) {
            this.data = {};
            this.length = 0;
            this.lengthDecrementCallbacks = [];
            this.lengthIncrementCallbacks = [];
            if (iterable) {
                for (var i = 0; i < iterable.length; i++) {
                    this.set(iterable[i][0], iterable[i][1]);
                }
            }
        }
        WeakMap.prototype.set = function (key, value) {
            var hadKey = this.has(key);
            this.data[uid(key)] = this.setInternal(key, value);
            if (!hadKey) {
                this.incrementLength();
            }
            return this;
        };
        WeakMap.prototype.get = function (key) {
            if (this.has(key)) {
                return this.data[uid(key)][1];
            }
        };
        WeakMap.prototype.delete = function (key) {
            var hadKey = this.has(key);
            this.data[uid(key)] = undefined;
            if (hadKey) {
                this.decrementLength();
            }
        };
        WeakMap.prototype.has = function (key) {
            return !!this.data[uid(key)];
        };
        WeakMap.prototype.decrementLength = function () {
            this.length--;
            for (var i = 0; i < this.lengthDecrementCallbacks.length; i++) {
                this.lengthDecrementCallbacks[i]();
            }
        };
        WeakMap.prototype.incrementLength = function () {
            this.length++;
            for (var i = 0; i < this.lengthIncrementCallbacks.length; i++) {
                this.lengthIncrementCallbacks[i]();
            }
        };
        WeakMap.prototype.setInternal = function (key, value) {
            return [, value];
        };
        WeakMap.prototype.onLengthDecrement = function (callback) {
            this.lengthDecrementCallbacks.push(callback);
        };
        WeakMap.prototype.onLengthIncrement = function (callback) {
            this.lengthIncrementCallbacks.push(callback);
        };
        return WeakMap;
    })();
    structs.WeakMap = WeakMap;
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map(iterable) {
            _super.call(this, iterable);
            this.resetLengthCallbacks = [];
        }
        ;
        Map.prototype.setInternal = function (key, value) {
            return [key, value];
        };
        Map.prototype.forEachEntry = function (callback) {
            for (var property in this.data) {
                if (this.data.hasOwnProperty(property)) {
                    var entry = this.data[property];
                    if (entry) {
                        callback(entry);
                    }
                }
            }
        };
        Map.prototype.forEach = function (callback, thisArg) {
            var _this = this;
            thisArg = thisArg || this;
            this.forEachEntry(function (entry) {
                callback.call(thisArg, entry[0], entry[1], _this);
            });
        };
        Map.prototype.clear = function () {
            this.data = {};
            this.resetLength();
        };
        Map.prototype.entries = function () {
            var entries = [];
            this.forEachEntry(function (entry) {
                entries.push(entry);
            });
            return entries;
        };
        Map.prototype.keys = function () {
            var keys = [];
            this.forEachEntry(function (entry) {
                keys.push(entry[0]);
            });
            return keys;
        };
        Map.prototype.values = function () {
            var values = [];
            this.forEachEntry(function (entry) {
                values.push(entry[1]);
            });
            return values;
        };
        Map.prototype.onResetLength = function (callback) {
            this.resetLengthCallbacks.push(callback);
        };
        Map.prototype.resetLength = function () {
            this.length = 0;
            for (var i = 0; i < this.resetLengthCallbacks.length; i++) {
                this.resetLengthCallbacks[i]();
            }
        };
        return Map;
    })(WeakMap);
    structs.Map = Map;
    var BaseSet = (function () {
        function BaseSet(values) {
            var _this = this;
            this.size = 0;
            this.length = 0;
            this.initData();
            this.data.onLengthDecrement(function () {
                _this.length--;
                _this.size--;
            });
            this.data.onLengthIncrement(function () {
                _this.length++;
                _this.size++;
            });
            if (values) {
                for (var i = 0; i < values.length; i++) {
                    this.add(values[i]);
                }
            }
        }
        BaseSet.prototype.initData = function () { };
        BaseSet.prototype.add = function (value) {
            this.data.set(value, value);
            return this;
        };
        BaseSet.prototype.delete = function (value) {
            this.data.delete(value);
        };
        BaseSet.prototype.has = function (value) {
            return this.data.has(value);
        };
        return BaseSet;
    })();
    var WeakSet = (function (_super) {
        __extends(WeakSet, _super);
        function WeakSet() {
            _super.apply(this, arguments);
        }
        WeakSet.prototype.initData = function () {
            this.data = new WeakMap();
        };
        WeakSet.prototype.add = function (value) {
            _super.prototype.add.call(this, value);
            return this;
        };
        return WeakSet;
    })(BaseSet);
    structs.WeakSet = WeakSet;
    var Set = (function (_super) {
        __extends(Set, _super);
        function Set(values) {
            var _this = this;
            _super.call(this, values);
            this.data.onResetLength(function () {
                _this.length = 0;
                _this.size = 0;
            });
        }
        Set.prototype.initData = function () {
            this.data = new Map();
        };
        Set.prototype.add = function (value) {
            _super.prototype.add.call(this, value);
            return this;
        };
        Set.prototype.clear = function () {
            this.data.clear();
        };
        Set.prototype.entries = function () {
            return this.data.entries();
        };
        Set.prototype.forEach = function (callback, thisArg) {
            var _this = this;
            thisArg = thisArg || this;
            this.data.forEach(function (v, k) {
                callback.call(thisArg, v, k, _this);
            });
        };
        Set.prototype.keys = function () {
            return this.data.keys();
        };
        Set.prototype.values = function () {
            return this.data.values();
        };
        return Set;
    })(BaseSet);
    structs.Set = Set;
})(structs || (structs = {}));
