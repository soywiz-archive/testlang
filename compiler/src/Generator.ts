import Nodes = require('./Nodes');
import IndentedStringWriter = require('./IndentedStringWriter');

class Generator
{
    private output:IndentedStringWriter = new IndentedStringWriter();

    constructor()
    {
    }

    public static convertNodeToString(node:Nodes.Node):string
    {
        var generator:Generator = new Generator();
        generator.generate(node);
        return generator.getString();
    }

    generate(node:Nodes.Node):void
    {
        if (node instanceof Nodes.NodeExprLiteral) return this.generateNodeExprLiteral(<any>node);
        if (node instanceof Nodes.NodeExprBinary) return this.generateNodeExprBinary(<any>node);
        if (node instanceof Nodes.NodeExprTernary) return this.generateNodeExprTernary(<any>node);
        if (node instanceof Nodes.NodeExprUnary) return this.generateNodeExprUnary(<any>node);
        throw('Error generating: ' + JSON.stringify(node));
    }

    private generateNodeExprLiteral(node:Nodes.NodeExprLiteral):void
    {
        this.output.write(String(node.value));
    }

    private generateNodeExprBinary(node:Nodes.NodeExprBinary):void
    {
        this.output.write('(');
        this.generate(node.left);
        this.output.write(' ');
        this.output.write(String(node.operator));
        this.output.write(' ');
        this.generate(node.right);
        this.output.write(')');
    }

    private generateNodeExprTernary(node:Nodes.NodeExprTernary):void
    {
        this.output.write('(');
        this.generate(node.compExpr);
        this.output.write(' ? ');
        this.generate(node.trueExpr);
        this.output.write(' : ');
        this.generate(node.falseExpr);
        this.output.write(')');
    }

    private generateNodeExprUnary(node:Nodes.NodeExprUnary):void
    {
        this.output.write(String(node.operator));
        this.generate(node.right);
    }

    getString():string
    {
        return this.output.getString();
    }
}

export = Generator;