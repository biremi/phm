###
PHM.log module
###
(->
  exports = this
  self = exports.PHM.log = {}

  self.info = (message) ->
    logToConsole('info', message)

  self.error = (message) ->
    logToConsole('error', message)

  logToConsole = (logLevel, message) ->
    ts = getTimestamp()
    log = (obj) -> 
      console[logLevel](obj)
    if typeof(message) == 'string'
      log("[#{ts}] #{message}")
    else
      log("[#{ts}]")
      log(message)

  getTimestamp = ->
    time = new Date()
    hours = getHours(time)
    minutes = getMinutes(time)
    seconds = getSeconds(time)
    milliseconds = getMilliseconds(time)
    "#{hours}:#{minutes}:#{seconds}.#{milliseconds}"

  getHours = (time) ->
    addTrailingZero(time.getHours())

  getMinutes = (time) ->
    addTrailingZero(time.getMinutes())

  getSeconds = (time) ->
    addTrailingZero(time.getSeconds())

  getMilliseconds = (time) ->
    ms = time.getMilliseconds()
    if ms < 10
      "00#{ms}"
    else if ms < 100
      "0#{ms}"
    else
      "#{ms}"

  addTrailingZero = (number) ->
    if number < 10
      "0#{number}"
    else
      "#{number}"
)()
