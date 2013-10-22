var Scheduler = (function () {
    function Scheduler() {
        this.last_call_id = 0;
        this.calls = {};
        this.callQueue = [];
    }
    /**
    * @return
    * returns false if function was executed synchronously
    * returns true if function is being executed asynchronously
    */
    Scheduler.prototype.schedule = function (parentCallState, functionName, locals) {
        var call_id = this.last_call_id++;
        var callState = {
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
    };

    Scheduler.prototype.__schedule = function (callState) {
        var call_id = this.last_call_id;
        callState.call_id = call_id;
        this.calls[call_id] = callState;
        return call_id;
    };

    Scheduler.prototype.done_value = function (callState, value) {
        this.__done(callState, false, value);
    };

    Scheduler.prototype.done_error = function (callState, error) {
        this.__done(callState, true, error);
    };

    Scheduler.prototype.__done = function (callState, error, value) {
        var call = this.calls[callState.caller_id];
        call.result_error = error;
        call.result_value = value;
        this.callQueue.push(call.call_id);
        this.executeQueued();
    };

    Scheduler.prototype.executeQueued = function () {
        while (this.callQueue.length > 0) {
            var call_id = this.callQueue.shift();
            var call = this.calls[call_id];
            this.debug(call);
            functions[call.function_name](call, this);
        }
    };

    Scheduler.prototype.getResult = function (callState) {
        if (callState.result_error)
            throw (callState.result_value);
        return callState.result_value;
    };

    Scheduler.prototype.return_async = function (callState) {
        return true;
    };

    Scheduler.prototype.return_sync = function (callState) {
        return false;
    };

    Scheduler.prototype.debug = function (callState) {
        console.log('## callState:' + callState.function_name + '@' + callState.state + ':' + JSON.stringify(callState.locals));
    };
    return Scheduler;
})();

var functions = {};

functions.downloadUrl = function (localState, api) {
    setTimeout(function () {
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
functions.test__v1 = function (localState, api) {
    try  {
        while (true) {
            switch (localState.state) {
                case 0:
                    localState.state = 1;
                    if (api.schedule(localState, 'downloadUrl', { position: { x: 0, y: 0 } }))
                        return;
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
};

/*
function main() {
test();
}
}
*/
functions.main__v1 = function (localState, api) {
    try  {
        while (true) {
            switch (localState.state) {
                case 0:
                    localState.state = 1;
                    if (api.schedule(localState, 'test__v1', {}))
                        return;
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
//# sourceMappingURL=sample.js.map
