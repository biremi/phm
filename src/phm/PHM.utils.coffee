###
PHM.utils module
###
exports = this
self = exports.PHM.utils = {}
self.uniqIdShift = 0

# Common class methods
self.extend = (obj, mixin) ->
  obj[name] = method for name, method of mixin        
  obj

self.include = (klass, mixin) ->
  self.extend klass.prototype, mixin

# Helper methods
self.generateUniqId = () ->
  time = new Date()
  time.getTime() + "_" + self.uniqIdShift++
