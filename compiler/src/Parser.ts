import Tokenizer = require('./Tokenizer');
import StringReader = require('./StringReader');
import Token = require('./Token');
import TokenType = require('./TokenType');
import Nodes = require('./Nodes');

class Parser
{
    constructor(private tokenizer:Tokenizer)
    {
    }

    public static fromString(data:string):Parser
    {
        return new Parser(new Tokenizer(new StringReader(data)));
    }

    parseExpression():Nodes.NodeExpr
    {
        return this.parseBinary();
    }

    /**
     * @TODO: Make this method faster and simpler.
     *
     * @param parts
     * @param operators
     */
    private compactBinaryOperatorPrecedence(parts:any[], operators:any[]):void
    {
        for (var n:number = 1; n < parts.length;)
        {
            if (operators.indexOf(parts[n]) >= 0)
            {
                parts.splice(n - 1, 3, new Nodes.NodeExprBinary(parts[n], parts[n - 1], parts[n + 1]))
            }
            else
            {
                n += 2;
            }
        }
    }

    private constructBinaryOperatorPrecedence(parts:any[]):Nodes.NodeExpr
    {
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

        if (parts.length != 1) throw(new Error("Can't compact operators"));
        return parts[0];
    }

    private parseBinary():Nodes.NodeExpr
    {
        var parts:any[] = [];
        while (true)
        {
            parts.push(this.parseTernary());
            if (!this.tokenizer.peekExpectToken('+', '-', '*', '/', '%')) break;
            parts.push(this.tokenizer.readToken().rawValue);
        }

        return this.constructBinaryOperatorPrecedence(parts);
    }

    private parseTernary():Nodes.NodeExpr
    {
        var expr:Nodes.NodeExpr = this.parseUnary();
        if (this.tokenizer.peekExpectToken('?'))
        {
            this.tokenizer.skipToken();
            var trueExpr:Nodes.NodeExpr = this.parseExpression();
            this.tokenizer.readAndExpectToken(':');
            var falseExpr:Nodes.NodeExpr = this.parseExpression();
            expr = new Nodes.NodeExprTernary(expr, trueExpr, falseExpr);
        }
        return expr;
    }

    private parseUnary():Nodes.NodeExpr
    {
        var token:Token = this.tokenizer.peekToken();
        switch (token.value)
        {
            // Parenthesis
            case '(':
                this.tokenizer.skipToken();
                var expr:Nodes.NodeExpr = this.parseExpression();
                this.tokenizer.readAndExpectToken(')');
                return expr;
                break;
            // Unary operator
            case '-':
            case '+':
            case '!':
            case '~':
                var operator:string = this.tokenizer.readToken().rawValue;
                var expr:Nodes.NodeExpr = this.parseUnary();
                return new Nodes.NodeExprUnary(operator, expr);
            default:
                if (token.type == TokenType.number)
                {
                    this.tokenizer.skipToken();
                    return new Nodes.NodeExprLiteral(token.value);
                }
                throw(new Error("Invalid token : " + token));
        }
    }
}

export = Parser;