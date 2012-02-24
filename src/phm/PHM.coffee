exports = this
self = exports.PHM = {} if !exports.PHM

self.initBlurHandler = ->
  $(document).click ->
    self.processBlur()

self.throwException = (type, text) ->
  throw "PHM Exception (#{type}): #{text}"

self.processBlur = ->
  focusWidget = PHM.app.focusWidget
  if focusWidget?
    focusWidget.fireBlur()
    PHM.app.focusWidget = null
