/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/mocha.d.ts" />

import assert = require('assert');

import Tokenizer = require('../src/Tokenizer');
import StringReader = require('../src/StringReader');

describe('TokenizerTest', () => {
    it('simple1', () => {
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
