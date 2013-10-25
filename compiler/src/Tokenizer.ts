import StringReader = require('./StringReader');
import Token = require('./Token');
import TokenType = require('./TokenType');

class Tokenizer
{
    private static operators:any = [
        '===', '!===',
        '==', '!=',
        '>=', '<=', '>', '<', '=', '<<', '>>', '<<<',
        '(', ')',
        '[', ']',
        '{', '}',
        '||', '&&',
        ',', '.', ';', ':',
        '+', '-', '*', '/', '%',
        '&', '|', '^',
        '~', '!',
        '?'
    ];

    constructor(private reader:StringReader)
    {
    }

    private readTryMatch(items:string[], maxLength:number):string
    {
        for (var n:number = maxLength - 1; n >= 0; n--)
        {
            if (items.indexOf(this.reader.peek(n)) >= 0)
            {
                return this.reader.read(n);
            }
        }
        return "";
    }

    private static parseInt(str:string):number
    {
        var base:number = 10;
        if (str.substr(0, 2) == '0x') { str = str.substr(2); base = 16; }
        else if (str.substr(0, 2) == '0b') { str = str.substr(2); base = 2; }
        else if (str.substr(0, 1) == '0') { base = 8;}
        return parseInt(str, base);
    }

    private peeked:boolean = false;
    private peekedToken:Token;

    peekToken():Token
    {
        if (!this.peeked)
        {
            this.peekedToken = this._readToken();
            this.peeked = true;
        }
        return this.peekedToken;
    }

    skipToken():void
    {
        if (!this.peeked) this.peekToken();
        this.peeked = false;
    }

    peekExpectToken(...expectedList: string[]):Token
    {
        var token:Token = this.peekToken();
        return (expectedList.indexOf(token.rawValue) >= 0) ? token : null;
    }

    readAndExpectToken(...expectedList: string[]):Token
    {
        var token:Token = this.readToken();
        if (expectedList.indexOf(token.rawValue) < 0) throw(new Error("Expected " + expectedList + " but found '" + token + "'"));
        return token;
    }

    readToken():Token
    {
        var token:Token = this.peekToken();
        this.skipToken();
        return token;
    }

    private _readToken():Token
    {
        var tokenRawString:string;

        // Ignore spaces.
        this.reader.readRegexp(/\s+/);

        if (!this.reader.hasMore) return new Token('', TokenType.end);

        // Try read an operator.
        tokenRawString = this.readTryMatch(Tokenizer.operators, 3);
        if (tokenRawString !== '') return new Token(tokenRawString, TokenType.operator);

        // Try read an keyword/identifier.
        tokenRawString = this.reader.readRegexp(/[a-zA-Z_]\w*/);
        if (tokenRawString !== '') return new Token(tokenRawString, TokenType.identifier);

        // Try read a number.
        tokenRawString = this.reader.readRegexp(/((0b[01]+)|(0x[0-9A-Fa-f]+)|(0[0-7]*)|([0-9]+))/);
        if (tokenRawString !== '') return new Token(tokenRawString, TokenType.number, Tokenizer.parseInt(tokenRawString));

        // @TODO: Try read a string literal.

        throw("Invalid token '" + this.reader.peek(8) + "' at " + this.reader.offset + ".");
    }
}

export = Tokenizer;