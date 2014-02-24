var TokenType = require('./TokenType');

var Token = (function () {
    function Token(rawValue, type, value) {
        if (typeof value === "undefined") { value = null; }
        this.rawValue = rawValue;
        this.type = type;
        this.value = value;
        if (this.value === null)
            this.value = rawValue;
    }
    Token.prototype.toString = function () {
        var ret = TokenType[this.type] + '@' + this.rawValue;
        if (String(this.rawValue) != String(this.value))
            ret += '@' + this.value;
        return ret;
    };
    return Token;
})();

module.exports = Token;
//# sourceMappingURL=Token.js.map
