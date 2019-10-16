class Emitter {
    private _callbacks: { [index: string]: Function[]; } = {};
    public on(event: string, fn: Function): this {
        this._callbacks = this._callbacks || {};

        (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
            .push(fn);
        return this;
    };
    public once(event: string, fn: Function): this {
        function on() {
            this.off(event, on);
            fn.apply(this, arguments);
        }
    
        on.fn = fn;
        this.on(event, on);
        return this;
    };
    public off(event?: string, fn?: Function): this {
        this._callbacks = this._callbacks || {};

        // all
        if (0 == arguments.length) {
            this._callbacks = {};
            return this;
        }

        // specific event
        var callbacks = this._callbacks['$' + event];
        if (!callbacks) return this;

        // remove all handlers
        if (1 == arguments.length) {
            delete this._callbacks['$' + event];
            return this;
        }

        // remove specific handler
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }

        // Remove event specific arrays for event types that no
        // one is subscribed for to avoid memory leak.
        if (callbacks.length === 0) {
            delete this._callbacks['$' + event];
        }

        return this;
    }
    public emit(event: string, ...args: any[]): this {
        this._callbacks = this._callbacks || {};

        var args = new Array(arguments.length - 1)
            , callbacks = this._callbacks['$' + event];

        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }

        return this;
    }
    public listeners(event: string): Array<Function> {
        this._callbacks = this._callbacks || {};
        return this._callbacks['$' + event] || [];
    };
    public hasListeners(event: string): boolean {
        return !!this.listeners(event).length;
    };
}
export default Emitter;