var TokenType;
(function (TokenType) {
    TokenType[TokenType["end"] = 0] = "end";
    TokenType[TokenType["operator"] = 1] = "operator";
    TokenType[TokenType["identifier"] = 2] = "identifier";
    TokenType[TokenType["number"] = 3] = "number";
    TokenType[TokenType["string"] = 4] = "string";
})(TokenType || (TokenType = {}));


module.exports = TokenType;

//# sourceMappingURL=TokenType.js.map
