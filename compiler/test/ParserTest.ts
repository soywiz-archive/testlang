/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/mocha.d.ts" />

import assert = require('assert');

import Generator = require('../src/Generator');
import Parser = require('../src/Parser');
import Tokenizer = require('../src/Tokenizer');
import StringReader = require('../src/StringReader');

function getGeneratedExpression(str:string):string
{
    return Generator.convertNodeToString(Parser.fromString(str).parseExpression());
}

function evaluateExpression(str:string):any
{
    return eval(getGeneratedExpression(str));
}

describe('ParserTest', () => {
    it('simple1', () => {
        assert.equal(0, evaluateExpression('0'));
        assert.equal(1, evaluateExpression('1'));
        assert.equal(-1, evaluateExpression('-1'));
        assert.equal('(1 + 2)', getGeneratedExpression('1 + 2'));
        assert.equal(3, evaluateExpression('1 + 2'));
        assert.equal(9, evaluateExpression('2 + 3 + 4'));
        assert.equal(2 * 3 + 4, evaluateExpression('2 * 3 + 4'));
        assert.equal(2 + 3 * 4, evaluateExpression('2 + 3 * 4'));
        assert.equal(2 * (3 + 4), evaluateExpression('2 * (3 + 4)'));
        assert.equal((2 + 3) * 4, evaluateExpression('(2 + 3) * 4'));
        assert.equal('(0 ? 1 : 2)', getGeneratedExpression('0 ? 1 : 2'));
        assert.equal('(1 ? 1 : 2)', getGeneratedExpression('1 ? 1 : 2'));
        assert.equal(0, evaluateExpression('0 ? 2 : 0'));
        assert.equal(2, evaluateExpression('1 ? 2 : 0'));
    });
});
