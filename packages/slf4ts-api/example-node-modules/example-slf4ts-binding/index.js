function Logger() {
    this.calls = [];
    this.log = function() {
        this.calls.push(arguments);
        // console.log.apply(console, arguments);
    };
    this.getImplementation = function() {
        return console;
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
