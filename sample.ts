interface LocalState {
	@function_name: string;
	@call_id: number;
	@result_error: boolean;
	@result_value: any;
	@state: number;
	@locals: any;
}

class Scheduler
{
	last_call_id: number = 0;
	calls: any = {};
	callQueue: Function[];

	schedule(parentLocalState, functionName, locals) {
		var localState = {
			@caller_id: parentLocalState ? parentLocalState.@call_id : -1,
			@function_name: functionName,
			@locals: locals,
		};
	}

	__schedule(localState) {
		var call_id = this.last_call_id;
		localState.@call_id = call_id;
		this.calls[call_id] = localState;
		return call_id;
	}

	done_value(localState, value) {
		this.__done(localState, false, value);
	}

	done_error(localState, error) {
		this.__done(localState, true, error);
	}

	__done(localState, error, value) {
		var call = this.calls[localState.@caller_id];
		call.@result_error = error;
		call.@result_value = value;
		this.callQueue.push(call.@call_id);
		this.executeQueued();
	}

	executeQueued() {
		while (this.callQueue.length > 0) {
			var call_id = this.callQueue.shift();
			var call = this.calls[call_id];
			functions[call.@function_name](call, this);
		}
	}

	getResult(localState) {
		if (localState.@result_error) throw(localState.@result_value);
		return localState.@result_value;
	}
}

var functions = {};

functions.downloadUrl = function(localState, api) {
	setTimeout(function() {
		api.done_value(localState, 'Hello World!');
	}, 1000);
};

functions.test__v1 = function(localState, api) {
	try {
		while (true) {
			switch (localState.@state) {
				case 0:
					Scheduler__schedule(localState, 'downloadUrl', { position: { x: 0, y: 0 } });
					localState.@state = 1;
					return;
				break;
				case 1:
					localState.@locals.html = api.getResult(localState);
					trace('wow!: ' + localState.@locals.html);
					api.done_value(localState, 123456);
				break;
			}
		}
	} catch (e) {
		api.done_error(localState, e);
	}
}

functions.main__v1 = function(localState, api) {
	try {
		switch (localState.@state) {
			case 0:
				api.schedule(localState, {
					@function_name: 'test__v1'
					@locals: { }
				});
				return;
			break;
			case 1:

			break;
		}
	} catch (e) {
		api.done_error(localState, e);
	}
};

//test();

var scheduler = new Scheduler();
scheduler.schedule(null, {
	@function_name: 'main__v1'
	@caller_id: -1,
	@locals: { }
});
scheduler.executeQueued();
