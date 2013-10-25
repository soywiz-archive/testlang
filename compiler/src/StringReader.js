var StringReader = (function () {
    function StringReader(data, _offset) {
        if (typeof _offset === "undefined") { _offset = 0; }
        this.data = data;
        this._offset = _offset;
    }
    StringReader.prototype.peek = function (count) {
        return this.data.substr(this._offset, count);
    };

    StringReader.prototype.skip = function (count) {
        this._offset += count;
    };

    StringReader.prototype.peekRegexp = function (regexp) {
        if (regexp.source.substr(0, 1) != '^')
            regexp = new RegExp('^' + regexp.source);
        var match = this.data.substr(this._offset).match(regexp);
        if (match === null)
            return '';
        return match[0];
    };

    StringReader.prototype.read = function (count) {
        var out = this.peek(count);
        this.skip(count);
        return out;
    };

    StringReader.prototype.readRegexp = function (regexp) {
        var out = this.peekRegexp(regexp);
        this.skip(out.length);
        return out;
    };

    Object.defineProperty(StringReader.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(StringReader.prototype, "hasMore", {
        get: function () {
            return this._offset < this.data.length;
        },
        enumerable: true,
        configurable: true
    });
    return StringReader;
})();


module.exports = StringReader;

//# sourceMappingURL=StringReader.js.map
