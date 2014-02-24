var Nodes = require('./Nodes');
var IndentedStringWriter = require('./IndentedStringWriter');

var Generator = (function () {
    function Generator() {
        this.output = new IndentedStringWriter();
    }
    Generator.convertNodeToString = function (node) {
        var generator = new Generator();
        generator.generate(node);
        return generator.getString();
    };

    Generator.prototype.generate = function (node) {
        if (node instanceof Nodes.NodeExprLiteral)
            return this.generateNodeExprLiteral(node);
        if (node instanceof Nodes.NodeExprBinary)
            return this.generateNodeExprBinary(node);
        if (node instanceof Nodes.NodeExprTernary)
            return this.generateNodeExprTernary(node);
        if (node instanceof Nodes.NodeExprUnary)
            return this.generateNodeExprUnary(node);
        throw ('Error generating: ' + JSON.stringify(node));
    };

    Generator.prototype.generateNodeExprLiteral = function (node) {
        this.output.write(String(node.value));
    };

    Generator.prototype.generateNodeExprBinary = function (node) {
        this.output.write('(');
        this.generate(node.left);
        this.output.write(' ');
        this.output.write(String(node.operator));
        this.output.write(' ');
        this.generate(node.right);
        this.output.write(')');
    };

    Generator.prototype.generateNodeExprTernary = function (node) {
        this.output.write('(');
        this.generate(node.compExpr);
        this.output.write(' ? ');
        this.generate(node.trueExpr);
        this.output.write(' : ');
        this.generate(node.falseExpr);
        this.output.write(')');
    };

    Generator.prototype.generateNodeExprUnary = function (node) {
        this.output.write(String(node.operator));
        this.generate(node.right);
    };

    Generator.prototype.getString = function () {
        return this.output.getString();
    };
    return Generator;
})();

module.exports = Generator;
//# sourceMappingURL=Generator.js.map
