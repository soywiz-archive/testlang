class StringReader
{
    constructor(private data:string, private _offset:number = 0)
    {
    }

    public peek(count:number):string
    {
        return this.data.substr(this._offset, count);
    }

    public skip(count:number):void
    {
        this._offset += count;
    }

    public peekRegexp(regexp:RegExp):string
    {
        if (regexp.source.substr(0, 1) != '^') regexp = new RegExp('^' + regexp.source);
        var match = this.data.substr(this._offset).match(regexp);
        if (match === null) return '';
        return match[0];
    }

    public read(count:number):string
    {
        var out:string = this.peek(count);
        this.skip(count);
        return out;
    }

    public readRegexp(regexp:RegExp):string
    {
        var out:string = this.peekRegexp(regexp);
        this.skip(out.length);
        return out;
    }

    public get offset():number
    {
        return this._offset;
    }

    public get hasMore():boolean
    {
        return this._offset < this.data.length;
    }
}

export = StringReader;