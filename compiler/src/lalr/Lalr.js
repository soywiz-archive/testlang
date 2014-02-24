var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LNode = (function () {
    function LNode() {
    }
    return LNode;
})();

var LNodeContainer = (function (_super) {
    __extends(LNodeContainer, _super);
    function LNodeContainer(nodes) {
        if (typeof nodes === "undefined") { nodes = []; }
        _super.call(this);
        this.nodes = nodes;
    }
    LNodeContainer.prototype.push = function (node) {
        this.nodes.push(node);
    };
    return LNodeContainer;
})(LNode);

var LLiteral = (function (_super) {
    __extends(LLiteral, _super);
    function LLiteral(value) {
        _super.call(this);
        this.value = value;
    }
    return LLiteral;
})(LNode);

var LSequence = (function (_super) {
    __extends(LSequence, _super);
    function LSequence() {
        _super.apply(this, arguments);
    }
    return LSequence;
})(LNodeContainer);

var LOr = (function (_super) {
    __extends(LOr, _super);
    function LOr() {
        _super.apply(this, arguments);
    }
    return LOr;
})(LNodeContainer);

var LParser = (function () {
    function LParser() {
    }
    return LParser;
})();

function sequence() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    return new LSequence(nodes(args));
}

function or() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    return new LOr(nodes(args));
}

function nodes(args) {
    return args.map(function (arg) {
        return node(arg);
    });
}

function node(value) {
    if (value instanceof LNode)
        return value;
    return literal(value);
}

function literal(value) {
    return new LLiteral(value);
}

function optional(arg) {
    return new LNode();
}

function repeatZeroOrMoreTimes(element) {
    var sequence = new LSequence();
    sequence.push(element);
    sequence.push(sequence);
    return sequence;
}

var packageStatement = sequence('package', ';');
var topLevel = or(sequence());
var topLevelList = repeatZeroOrMoreTimes(topLevel);
var haxeFile = sequence(optional(packageStatement), '');

'' + '';
//# sourceMappingURL=Lalr.js.map
