// http://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol
var Application = (function () {
    function Application() {
        this.functions = {};
        this.last_call_id = 0;
        this.callStates = {};
        this.callQueue = [];
    }
    /**
    * @return
    * returns false if function was executed synchronously
    * returns true if function is being executed asynchronously
    */
    Application.prototype.schedule = function (parentCallState, functionName, arguments) {
        var call_id = this.last_call_id++;
        var callState = {
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
    };

    Application.prototype.__schedule = function (callState) {
        var call_id = this.last_call_id;
        callState.call_id = call_id;
        this.callStates[call_id] = callState;
        return call_id;
    };

    Application.prototype.done_value = function (callState, value) {
        this.__done(callState, false, value);
    };

    Application.prototype.done_error = function (callState, error) {
        this.__done(callState, true, error);
    };

    Application.prototype.__done = function (callState, error, value) {
        var call = this.callStates[callState.caller_id];
        if (call) {
            call.result_error = error;
            call.result_value = value;
            this.callQueue.push(call.call_id);
        }
        this.executeQueued();
    };

    Application.prototype.serialize = function () {
        console.log(JSON.stringify(this));
    };

    Application.prototype.executeQueued = function () {
        while (this.callQueue.length > 0) {
            var call_id = this.callQueue.shift();
            var call = this.callStates[call_id];
            this.debug(call);
            this.functions[call.function_name](call, this);
        }
    };

    Application.prototype.getResult = function (callState) {
        if (callState.result_error)
            throw (callState.result_value);
        return callState.result_value;
    };

    Application.prototype.return_wait_async = function (callState) {
        return false;
    };

    Application.prototype.__done_remove_call = function (callState) {
        delete this.callStates[callState.call_id];
    };

    Application.prototype.return_complete_async = function (callState, result) {
        this.__done_remove_call(callState);
        this.done_value(callState, result);
        return true;
    };

    Application.prototype.return_error_async = function (callState, error) {
        this.__done_remove_call(callState);
        this.done_error(callState, error);
        return true;
    };

    Application.prototype.return_sync = function (callState) {
        return false;
    };

    Application.prototype.debug = function (callState) {
        console.log('## callState:' + callState.function_name + '@' + callState.state + ':' + JSON.stringify(callState.locals));
    };
    return Application;
})();

var application = new Application();

application.functions.downloadUrl = function (callState, api) {
    setTimeout(function () {
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
application.functions.test__v1 = function (callState, api) {
    try  {
        while (true) {
            switch (callState.state) {
                case 0:
                    callState.state = 1;
                    if (api.schedule(callState, 'downloadUrl', [{ x: 0, y: 0 }]))
                        return api.return_wait_async(callState);
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
};

/*
function main() {
test();
}
}
*/
application.functions.main__v1 = function (callState, api) {
    try  {
        while (true) {
            switch (callState.state) {
                case 0:
                    callState.state = 1;
                    if (api.schedule(callState, 'test__v1', []))
                        return api.return_wait_async(callState);
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
//# sourceMappingURL=sample.js.map
