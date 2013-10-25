var IndentedStringWriter = (function () {
    function IndentedStringWriter() {
        this.output = '';
    }
    IndentedStringWriter.prototype.write = function (value) {
        this.output += value;
        return this;
    };

    IndentedStringWriter.prototype.getString = function () {
        return this.output;
    };
    return IndentedStringWriter;
})();


module.exports = IndentedStringWriter;

//# sourceMappingURL=IndentedStringWriter.js.map
