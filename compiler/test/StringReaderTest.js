/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/mocha.d.ts" />
var assert = require('assert');

var StringReader = require('../src/StringReader');

describe('StringReader', function () {
    it('simple1', function () {
        var stringReader = new StringReader('hello world');
        assert.equal(true, stringReader.hasMore);
        assert.equal('hello', stringReader.peek(5));
        assert.equal('hell', stringReader.peek(4));
        assert.equal('hello', stringReader.read(5));
        assert.equal(' ', stringReader.peek(1));
        assert.equal(' ', stringReader.read(1));
        assert.equal(true, stringReader.hasMore);
        assert.equal('world', stringReader.read(7));
        assert.equal(false, stringReader.hasMore);
    });

    it('regexp', function () {
        var stringReader = new StringReader('hello world');
        assert.equal('hello', stringReader.peekRegexp(/\w+/));
        assert.equal('hello', stringReader.readRegexp(/\w+/));
        assert.equal('', stringReader.readRegexp(/\w+/));
        assert.equal(' ', stringReader.readRegexp(/\s+/));
        assert.equal('world', stringReader.readRegexp(/\w+/));
        assert.equal(false, stringReader.hasMore);
    });
});

//# sourceMappingURL=StringReaderTest.js.map
