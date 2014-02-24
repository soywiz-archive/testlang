
class LNode
{
}

class LNodeContainer extends LNode
{
    constructor(private nodes:LNode[] = [])
    {
        super();
    }

    push(node:LNode)
    {
        this.nodes.push(node);
    }
}

class LLiteral extends LNode
{
    constructor(public value:string)
    {
        super();
    }
}

class LSequence extends LNodeContainer
{
}

class LOr extends LNodeContainer
{
}

class LParser
{

}

function sequence(...args:any[])
{
    return new LSequence(nodes(args));
}

function or(...args:LNode[])
{
    return new LOr(nodes(args));
}

function nodes(args:any[]):LNode[]
{
    return args.map(arg => node(arg));
}

function node(value:any)
{
    if (value instanceof LNode) return value;
    return literal(value);
}

function literal(value:string)
{
    return new LLiteral(value);
}

function optional(arg:any)
{
    return new LNode();
}

function repeatZeroOrMoreTimes(element:LNode)
{
    var sequence = new LSequence();
    sequence.push(element);
    sequence.push(sequence);
    return sequence;
}

var packageStatement = sequence('package', ';');
var topLevel = or(
    sequence()
);
var topLevelList = repeatZeroOrMoreTimes(topLevel);
var haxeFile = sequence(optional(packageStatement), '');

var test = "
";

//sequence('1', '2');