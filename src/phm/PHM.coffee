exports = this
self = exports.PHM = {
  VERSION: '0.1'
} if !exports.PHM

self.initBlurHandler = ->
  $(document).click ->
    self.processBlur()

self.throwException = (type, text) ->
  throw new Error("PHM Exception (#{type}): #{text}")

self.processBlur = ->
  focusWidget = PHM.app.focusWidget
  if focusWidget?
    focusWidget.fireBlur()
    PHM.app.focusWidget = null
