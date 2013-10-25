// http://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol

/*
 // Is this even possible with 100% immutable code?
 var a = { value : 1 }
 var b = { value : a }
 a.value = b;

 console.log(a);
 */

interface CallState {
    function_name: string;
    call_id: number;
    caller_id: number;
    result_error: boolean;
    result_value: any;
    state: number;
    arguments: any[];
    locals: any;
}

class Application
{
    functions: any = {};
    last_call_id: number = 0;
    callStates: any = {};
    callQueue: any[] = [];

    /**
     * @return
     * returns false if function was executed synchronously
     * returns true if function is being executed asynchronously
     */
        schedule(parentCallState:CallState, functionName:string, arguments:any[]):boolean {
        var call_id:number = this.last_call_id++;
        var callState:CallState = {
            function_name: functionName,
            call_id: call_id,
            caller_id: parentCallState ? parentCallState.call_id : -1,
            result_error: false,
            result_value: undefined,
            state: 0,
            arguments: arguments,
            locals: {}
        };

        this.callStates[call_id] = callState;
        this.callQueue.push(call_id);

        return true;
    }

    private __schedule(callState:CallState):number {
        var call_id = this.last_call_id;
        callState.call_id = call_id;
        this.callStates[call_id] = callState;
        return call_id;
    }

    private done_value(callState:CallState, value:any)
    {
        this.__done(callState, false, value);
    }

    private done_error(callState:CallState, error:any) {
        this.__done(callState, true, error);
    }

    private __done(callState:CallState, error:boolean, value:any)
    {
        var call = this.callStates[callState.caller_id];
        if (call) {
            call.result_error = error;
            call.result_value = value;
            this.callQueue.push(call.call_id);
        }
        this.executeQueued();
    }

    serialize() {
        console.log(JSON.stringify(this));
    }

    executeQueued() {
        while (this.callQueue.length > 0) {
            var call_id = this.callQueue.shift();
            var call = this.callStates[call_id];
            this.debug(call);
            this.functions[call.function_name](call, this);
        }
    }

    getResult(callState:CallState) {
        if (callState.result_error) throw(callState.result_value);
        return callState.result_value;
    }

    return_wait_async(callState:CallState)
    {
        return false;
    }

    private __done_remove_call(callState:CallState)
    {
        delete this.callStates[callState.call_id];
    }

    return_complete_async(callState:CallState, result:any)
    {
        this.__done_remove_call(callState);
        this.done_value(callState, result);
        return true;
    }

    return_error_async(callState:CallState, error:any)
    {
        this.__done_remove_call(callState);
        this.done_error(callState, error);
        return true;
    }

    return_sync(callState:CallState)
    {
        return false;
    }

    debug(callState:CallState)
    {
        console.log('## callState:' + callState.function_name + '@' + callState.state + ':' + JSON.stringify(callState.locals));
    }
}


var application = new Application();

application.functions.downloadUrl = function(callState:CallState, api:Application) {
	setTimeout(function() {
		return api.return_complete_async(callState, 'Hello World!');
	}, 1000);
	return api.return_wait_async(callState);
};

/*
function test() {
	var html = downloadUrl({x : 0, y : 0});
	trace(html);
	return 123456;
}
*/
application.functions.test__v1 = function(callState:CallState, api:Application):any {
    //api.debug(callState);
	try {
		while (true) {
			switch (callState.state) {
				case 0:
					callState.state = 1;
					if (api.schedule(callState, 'downloadUrl', [ { x: 0, y: 0 } ])) return api.return_wait_async(callState);
				break;
				case 1:
                    callState.state = 2;
					callState.locals.html = api.getResult(callState);
				break;
                case 2:
                    console.log('wow!: ' + callState.locals.html);
                    return api.return_complete_async(callState, 123456);
                break;
			}
		}
	} catch (e) {
		return api.return_error_async(callState, e);
	}
}

/*
function main() {
	test();
}
}
*/
application.functions.main__v1 = function(callState:CallState, api:Application) {
    //api.debug(callState);
	try {
        while (true) {
            switch (callState.state) {
                case 0:
                    callState.state = 1;
                    if (api.schedule(callState, 'test__v1', [])) return api.return_wait_async(callState);
                break;
                case 1:
                    console.log('completed!');
                    return api.return_complete_async(callState, undefined);
                break;
            }
        }
	} catch (e) {
        return api.return_error_async(callState, e);
	}
};

//console.log(String(application.functions.main__v1));

//test();

application.schedule(null, 'main__v1', []);
application.executeQueued();
//setTimeout(function() { application.serialize(); }, 300);

/*
var net = require('net');
var server = net.createServer(function(c) { //'connection' listener
    console.log('server connected');
    c.on('end', function() {
        console.log('server disconnected');
    });
    c.write('hello\r\n');
    c.pipe(c);
});
server.listen(8124, '127.0.0.1', function() { //'listening' listener
    console.log('server bound: ');
    console.log(server.address());
});
*/

/*
 ## callState:main__v1@0:{}
 ## callState:test__v1@0:{}
 ## callState:downloadUrl@0:{"position":{"x":0,"y":0}}
 ## callState:test__v1@1:{}
 wow!: Hello World!
 ## callState:main__v1@1:{}
 */