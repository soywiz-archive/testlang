
export class Node
{
    constructor(public type:string = 'Node') {

    }
}

export class NodeExpr extends Node
{
    constructor(public type:string = 'NodeExpr')
    {
        super(type);
    }
}

export class NodeExprLiteral extends NodeExpr
{
    constructor(public value:any)
    {
        super('NodeExprLiteral');
    }
}

export class NodeExprUnary extends NodeExpr
{
    constructor(public operator:string, public right:NodeExpr)
    {
        super('NodeExprUnary');
    }
}

export class NodeExprBinary extends NodeExpr
{
    constructor(public operator:string, public left:NodeExpr, public right:NodeExpr)
    {
        super('NodeExprBinary');
    }
}

export class NodeExprTernary extends NodeExpr
{
    constructor(public compExpr:NodeExpr, public trueExpr:NodeExpr, public falseExpr:NodeExpr)
    {
        super('NodeExprTernary');
    }
}