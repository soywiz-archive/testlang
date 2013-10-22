interface CallState {
	function_name: string;
	call_id: number;
    caller_id: number;
	result_error: boolean;
	result_value: any;
	state: number;
	locals: any;
}

class Scheduler
{
	last_call_id: number = 0;
	calls: any = {};
	callQueue: any[] = [];

	/**
	 * @return
	 * returns false if function was executed synchronously
	 * returns true if function is being executed asynchronously
	 */
	schedule(parentCallState:CallState, functionName:string, locals:any):boolean {
        var call_id:number = this.last_call_id++;
		var callState:CallState = {
            function_name: functionName,
            call_id: call_id,
			caller_id: parentCallState ? parentCallState.call_id : -1,
            result_error: false,
            result_value: undefined,
            state: 0,
			locals: locals
		};

        this.calls[call_id] = callState;
        this.callQueue.push(call_id);

		return true;
	}

	__schedule(callState:CallState):number {
		var call_id = this.last_call_id;
		callState.call_id = call_id;
		this.calls[call_id] = callState;
		return call_id;
	}

	done_value(callState:CallState, value:any) {
		this.__done(callState, false, value);
	}

	done_error(callState:CallState, error:any) {
		this.__done(callState, true, error);
	}

	__done(callState:CallState, error:boolean, value:any) {
		var call = this.calls[callState.caller_id];
		call.result_error = error;
		call.result_value = value;
		this.callQueue.push(call.call_id);
		this.executeQueued();
	}

	executeQueued() {
		while (this.callQueue.length > 0) {
			var call_id = this.callQueue.shift();
			var call = this.calls[call_id];
            this.debug(call);
			functions[call.function_name](call, this);
		}
	}

	getResult(callState:CallState) {
		if (callState.result_error) throw(callState.result_value);
		return callState.result_value;
	}

	return_async(callState:CallState) {
		return true;
	}

	return_sync(callState:CallState) {
		return false;
	}

    debug(callState:CallState) {
        console.log('## callState:' + callState.function_name + '@' + callState.state + ':' + JSON.stringify(callState.locals));
    }
}

var functions:any = {};

functions.downloadUrl = function(localState:CallState, api:Scheduler) {
	setTimeout(function() {
		api.done_value(localState, 'Hello World!');
	}, 1000);
	//return api.return_sync(localState);
	return api.return_async(localState);
};

/*
function test() {
	var html = downloadUrl({x : 0, y : 0});
	trace(html);
	return 123456;
}
*/
functions.test__v1 = function(localState:CallState, api:Scheduler) {
    //api.debug(localState);
	try {
		while (true) {
			switch (localState.state) {
				case 0:
					localState.state = 1;
					if (api.schedule(localState, 'downloadUrl', { position: { x: 0, y: 0 } })) return;
				break;
				case 1:
                    localState.state = 2;
					localState.locals.html = api.getResult(localState);
				break;
                case 2:
                    console.log('wow!: ' + localState.locals.html);
                    api.done_value(localState, 123456);
                    return api.return_async(localState);
                break;
			}
		}
	} catch (e) {
		api.done_error(localState, e);
	}
}

/*
function main() {
	test();
}
}
*/
functions.main__v1 = function(localState:CallState, api:Scheduler) {
    //api.debug(localState);
	try {
        while (true) {
            switch (localState.state) {
                case 0:
                    localState.state = 1;
                    if (api.schedule(localState, 'test__v1', {})) return;
                break;
                case 1:
                    return;
                break;
            }
        }
	} catch (e) {
		api.done_error(localState, e);
	}
};

//test();

var scheduler = new Scheduler();
scheduler.schedule(null, 'main__v1', {});
scheduler.executeQueued();

/*
 ## callState:main__v1@0:{}
 ## callState:test__v1@0:{}
 ## callState:downloadUrl@0:{"position":{"x":0,"y":0}}
 ## callState:test__v1@1:{}
 wow!: Hello World!
 ## callState:main__v1@1:{}
 */