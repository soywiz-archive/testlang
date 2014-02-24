var StringReader = require('./StringReader');
var Token = require('./Token');
var TokenType = require('./TokenType');

var Tokenizer = (function () {
    function Tokenizer(reader) {
        this.reader = reader;
        this.peeked = false;
    }
    Tokenizer.prototype.readTryMatch = function (items, maxLength) {
        for (var n = maxLength - 1; n >= 0; n--) {
            if (items.indexOf(this.reader.peek(n)) >= 0) {
                return this.reader.read(n);
            }
        }
        return "";
    };

    Tokenizer.parseInt = function (str) {
        var base = 10;
        if (str.substr(0, 2) == '0x') {
            str = str.substr(2);
            base = 16;
        } else if (str.substr(0, 2) == '0b') {
            str = str.substr(2);
            base = 2;
        } else if (str.substr(0, 1) == '0') {
            base = 8;
        }
        return parseInt(str, base);
    };

    Tokenizer.prototype.peekToken = function () {
        if (!this.peeked) {
            this.peekedToken = this._readToken();
            this.peeked = true;
        }
        return this.peekedToken;
    };

    Tokenizer.prototype.skipToken = function () {
        if (!this.peeked)
            this.peekToken();
        this.peeked = false;
    };

    Tokenizer.prototype.peekExpectToken = function () {
        var expectedList = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            expectedList[_i] = arguments[_i + 0];
        }
        var token = this.peekToken();
        return (expectedList.indexOf(token.rawValue) >= 0) ? token : null;
    };

    Tokenizer.prototype.readAndExpectToken = function () {
        var expectedList = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            expectedList[_i] = arguments[_i + 0];
        }
        var token = this.readToken();
        if (expectedList.indexOf(token.rawValue) < 0)
            throw (new Error("Expected " + expectedList + " but found '" + token + "'"));
        return token;
    };

    Tokenizer.prototype.readToken = function () {
        var token = this.peekToken();
        this.skipToken();
        return token;
    };

    Tokenizer.prototype._readToken = function () {
        var tokenRawString;

        // Ignore spaces.
        this.reader.readRegexp(/\s+/);

        if (!this.reader.hasMore)
            return new Token('', 0 /* end */);

        // Try read an operator.
        tokenRawString = this.readTryMatch(Tokenizer.operators, 3);
        if (tokenRawString !== '')
            return new Token(tokenRawString, 1 /* operator */);

        // Try read an keyword/identifier.
        tokenRawString = this.reader.readRegexp(/[a-zA-Z_]\w*/);
        if (tokenRawString !== '')
            return new Token(tokenRawString, 2 /* identifier */);

        // Try read a number.
        tokenRawString = this.reader.readRegexp(/((0b[01]+)|(0x[0-9A-Fa-f]+)|(0[0-7]*)|([0-9]+))/);
        if (tokenRawString !== '')
            return new Token(tokenRawString, 3 /* number */, Tokenizer.parseInt(tokenRawString));

        throw ("Invalid token '" + this.reader.peek(8) + "' at " + this.reader.offset + ".");
    };
    Tokenizer.operators = [
        '===', '!===',
        '==', '!=',
        '>=', '<=', '>', '<', '=', '<<', '>>', '<<<',
        '(', ')',
        '[', ']',
        '{', '}',
        '||', '&&',
        ',', '.', ';', ':',
        '+', '-', '*', '/', '%',
        '&', '|', '^',
        '~', '!',
        '?'
    ];
    return Tokenizer;
})();

module.exports = Tokenizer;
//# sourceMappingURL=Tokenizer.js.map
