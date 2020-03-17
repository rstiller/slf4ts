function Logger () {
  this.calls = []
  this.setConfigCalls = []
  this.setLogLevelCalls = []
  this.setMetadataCalls = []
  this.setLoggerBuilderCalls = []
  this.log = function () {
    this.calls.push(arguments)
  }
  this.getImplementation = function () {
    return console
  }
  this.setConfig = function () {
    this.setConfigCalls.push(arguments)
  }
  this.setLogLevel = function () {
    this.setLogLevelCalls.push(arguments)
  }
  this.setMetadata = function () {
    this.setMetadataCalls.push(arguments)
  }
  this.setLoggerBuilder = function () {
    this.setLoggerBuilderCalls.push(arguments)
  }
};

module.exports = function register (bindings) {
  bindings.registerBinding({
    getLoggerImplementation: () => {
      return new Logger()
    },
    getVendor: () => 'Node.Console',
    getVersion: () => '1.0.0'
  })
}
