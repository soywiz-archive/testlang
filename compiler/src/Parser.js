var Tokenizer = require('./Tokenizer');
var StringReader = require('./StringReader');
var Token = require('./Token');
var TokenType = require('./TokenType');
var Nodes = require('./Nodes');

var Parser = (function () {
    function Parser(tokenizer) {
        this.tokenizer = tokenizer;
    }
    Parser.fromString = function (data) {
        return new Parser(new Tokenizer(new StringReader(data)));
    };

    Parser.prototype.parseExpression = function () {
        return this.parseBinary();
    };

    /**
    * @TODO: Make this method faster and simpler.
    *
    * @param parts
    * @param operators
    */
    Parser.prototype.compactBinaryOperatorPrecedence = function (parts, operators) {
        for (var n = 1; n < parts.length;) {
            if (operators.indexOf(parts[n]) >= 0) {
                parts.splice(n - 1, 3, new Nodes.NodeExprBinary(parts[n], parts[n - 1], parts[n + 1]));
            } else {
                n += 2;
            }
        }
    };

    Parser.prototype.constructBinaryOperatorPrecedence = function (parts) {
        this.compactBinaryOperatorPrecedence(parts, ['*', '/', '%']);
        this.compactBinaryOperatorPrecedence(parts, ['+', '-']);
        this.compactBinaryOperatorPrecedence(parts, ['<<', '>>']);
        this.compactBinaryOperatorPrecedence(parts, ['<', '<=', '>', '>=']);
        this.compactBinaryOperatorPrecedence(parts, ['==', '!=', '===', '!==']);
        this.compactBinaryOperatorPrecedence(parts, ['&']);
        this.compactBinaryOperatorPrecedence(parts, ['^']);
        this.compactBinaryOperatorPrecedence(parts, ['|']);
        this.compactBinaryOperatorPrecedence(parts, ['&&']);
        this.compactBinaryOperatorPrecedence(parts, ['||']);

        if (parts.length != 1)
            throw (new Error("Can't compact operators"));
        return parts[0];
    };

    Parser.prototype.parseBinary = function () {
        var parts = [];
        while (true) {
            parts.push(this.parseTernary());
            if (!this.tokenizer.peekExpectToken('+', '-', '*', '/', '%'))
                break;
            parts.push(this.tokenizer.readToken().rawValue);
        }

        return this.constructBinaryOperatorPrecedence(parts);
    };

    Parser.prototype.parseTernary = function () {
        var expr = this.parseUnary();
        if (this.tokenizer.peekExpectToken('?')) {
            this.tokenizer.skipToken();
            var trueExpr = this.parseExpression();
            this.tokenizer.readAndExpectToken(':');
            var falseExpr = this.parseExpression();
            expr = new Nodes.NodeExprTernary(expr, trueExpr, falseExpr);
        }
        return expr;
    };

    Parser.prototype.parseUnary = function () {
        var token = this.tokenizer.peekToken();
        switch (token.value) {
            case '(':
                this.tokenizer.skipToken();
                var expr = this.parseExpression();
                this.tokenizer.readAndExpectToken(')');
                return expr;
                break;

            case '-':
            case '+':
            case '!':
            case '~':
                var operator = this.tokenizer.readToken().rawValue;
                var expr = this.parseUnary();
                return new Nodes.NodeExprUnary(operator, expr);
            default:
                if (token.type == TokenType.number) {
                    this.tokenizer.skipToken();
                    return new Nodes.NodeExprLiteral(token.value);
                }
                throw (new Error("Invalid token : " + token));
        }
    };
    return Parser;
})();


module.exports = Parser;

//# sourceMappingURL=Parser.js.map
