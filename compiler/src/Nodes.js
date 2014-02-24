var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Node = (function () {
    function Node(type) {
        if (typeof type === "undefined") { type = 'Node'; }
        this.type = type;
    }
    return Node;
})();
exports.Node = Node;

var NodeExpr = (function (_super) {
    __extends(NodeExpr, _super);
    function NodeExpr(type) {
        if (typeof type === "undefined") { type = 'NodeExpr'; }
        _super.call(this, type);
        this.type = type;
    }
    return NodeExpr;
})(Node);
exports.NodeExpr = NodeExpr;

var NodeExprLiteral = (function (_super) {
    __extends(NodeExprLiteral, _super);
    function NodeExprLiteral(value) {
        _super.call(this, 'NodeExprLiteral');
        this.value = value;
    }
    return NodeExprLiteral;
})(NodeExpr);
exports.NodeExprLiteral = NodeExprLiteral;

var NodeExprUnary = (function (_super) {
    __extends(NodeExprUnary, _super);
    function NodeExprUnary(operator, right) {
        _super.call(this, 'NodeExprUnary');
        this.operator = operator;
        this.right = right;
    }
    return NodeExprUnary;
})(NodeExpr);
exports.NodeExprUnary = NodeExprUnary;

var NodeExprBinary = (function (_super) {
    __extends(NodeExprBinary, _super);
    function NodeExprBinary(operator, left, right) {
        _super.call(this, 'NodeExprBinary');
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    return NodeExprBinary;
})(NodeExpr);
exports.NodeExprBinary = NodeExprBinary;

var NodeExprTernary = (function (_super) {
    __extends(NodeExprTernary, _super);
    function NodeExprTernary(compExpr, trueExpr, falseExpr) {
        _super.call(this, 'NodeExprTernary');
        this.compExpr = compExpr;
        this.trueExpr = trueExpr;
        this.falseExpr = falseExpr;
    }
    return NodeExprTernary;
})(NodeExpr);
exports.NodeExprTernary = NodeExprTernary;
//# sourceMappingURL=Nodes.js.map
