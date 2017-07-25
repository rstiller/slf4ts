function Logger() {
    this.calls = [];
    this.setConfigCalls = [];
    this.log = function() {
        this.calls.push(arguments);
    };
    this.getImplementation = function() {
        return console;
    };
    this.setConfig = function() {
        this.setConfigCalls.push(arguments);
    };
};

module.exports = function register(bindings) {
    bindings.registerBinding({
        getLoggerImplementation: () => {
            return new Logger();
        },
        getVendor: () => "Node.Console",
        getVersion: () => "1.0.0"
    });
}
