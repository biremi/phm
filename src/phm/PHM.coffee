exports = this
self = exports.PHM = {
  VERSION: '0.1'
} if !exports.PHM

self.throwException = (type, text) ->
  throw new Error("PHM Exception (#{type}): #{text}")
