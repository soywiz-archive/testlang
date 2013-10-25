class IndentedStringWriter
{
    private output:string = '';

    constructor()
    {

    }

    write(value:string):IndentedStringWriter
    {
        this.output += value;
        return this;
    }

    getString():string
    {
        return this.output;
    }
}

export = IndentedStringWriter;