###
PHM.utils module
###
(->
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

  self.blinkTitle = (message, oldTitle) ->
    self.blinksLeft = 10
    self.doBlinkTick(message, oldTitle)

  self.doBlinkTick = (message, oldTitle) ->
    return if self.blinksLeft <= 0
    self.blinksLeft -= 1
    document.title = message
    setTimeout(->
      document.title = oldTitle
      setTimeout(->
        self.doBlinkTick(message, oldTitle)
      , 1000)
    , 1000)

  self.stopBlinkTitle = ->
    self.blinksLeft = 0

  self.formatTimeUTCtoLocal = (secondsUTC) ->
    date = new Date()
    date.setTime(secondsUTC * 1000)
    if self.isUSATime()
      time = time12h(date.getHours(), to2DigitFormat(date.getMinutes()))
      "#{date.getFullYear()}-#{to2DigitFormat(date.getMonth()+1)}-#{to2DigitFormat(date.getDate())} #{time}"
    else
      "#{date.getFullYear()}-#{to2DigitFormat(date.getMonth()+1)}-#{to2DigitFormat(date.getDate())} #{to2DigitFormat(date.getHours())}:#{to2DigitFormat(date.getMinutes())}"

  to2DigitFormat = (number) ->
    if number < 10 then "0#{number}" else number

  time12h = (hours, minutes) ->
    sufix = "AM"
    if hours >= 12
      hours -= 12
      sufix = "PM"
    hours = 12 if hours == 0
    "#{hours}:#{minutes} #{sufix}"

  self.getTimeOffset = ->
    now = new Date()
    jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
    temp = jan1.toGMTString()
    jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1))
    offset = (jan1 - jan2) / (1000 * 60 * 60)

  self.isUSATime = ->
    offset = self.getTimeOffset()
    (offset >= -10) and (offset <= -5)

  self.capitalize = (string) ->
    string.charAt(0).toUpperCase() + string.slice(1)

  self.loadScript = (sScriptSrc, callbackfunction) ->
    oHead = document.getElementsByTagName("head")[0]
    if oHead
      oScript = document.createElement("script")

      oScript.setAttribute "src", sScriptSrc
      oScript.setAttribute "type", "text/javascript"

      loadFunction = ->
        callbackfunction()  if @readyState is "complete" or @readyState is "loaded"

      oScript.onreadystatechange = loadFunction

      oScript.onload = callbackfunction

      oHead.appendChild oScript

  self.pageUrlParams = ->
    $.url(window.location.search).param()
    

  false
)()
