/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/mocha.d.ts" />
var assert = require('assert');

var Generator = require('../src/Generator');
var Parser = require('../src/Parser');
var Tokenizer = require('../src/Tokenizer');
var StringReader = require('../src/StringReader');

function getGeneratedExpression(str) {
    return Generator.convertNodeToString(Parser.fromString(str).parseExpression());
}

function evaluateExpression(str) {
    return eval(getGeneratedExpression(str));
}

describe('ParserTest', function () {
    it('simple1', function () {
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

//# sourceMappingURL=ParserTest.js.map
