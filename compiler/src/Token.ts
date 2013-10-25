import TokenType = require('./TokenType');

class Token
{
    constructor(public rawValue:string, public type:TokenType, public value:any = null)
    {
        if (this.value === null) this.value = rawValue;
    }

    toString():string
    {
        var ret:string = TokenType[this.type] + '@' + this.rawValue;
        if (String(this.rawValue) != String(this.value)) ret += '@' + this.value;
        return ret;
    }
}

export = Token;