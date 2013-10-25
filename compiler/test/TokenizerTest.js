/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/mocha.d.ts" />
var assert = require('assert');

var Tokenizer = require('../src/Tokenizer');
var StringReader = require('../src/StringReader');

describe('TokenizerTest', function () {
    it('simple1', function () {
        var stringReader = new Tokenizer(new StringReader('hello + world == 100 + 0x100 0b11'));
        assert.equal('identifier@hello', stringReader.readToken().toString());
        assert.equal('operator@+', stringReader.readToken().toString());
        assert.equal('identifier@world', stringReader.readToken().toString());
        assert.equal('operator@==', stringReader.readToken().toString());
        assert.equal('number@100', stringReader.readToken().toString());
        assert.equal('operator@+', stringReader.readToken().toString());
        assert.equal('number@0x100@256', stringReader.readToken().toString());
        assert.equal('number@0b11@3', stringReader.readToken().toString());
    });
});

//# sourceMappingURL=TokenizerTest.js.map
