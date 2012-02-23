(->
  exports = this
  self = exports.JAF = {} if !exports.JAF

  self.initBlurHandler = ->
    $(document).click ->
      self.processBlur()

  self.throwException = (type, text) ->
    throw "JAF Exception (#{type}): #{text}"

  self.processBlur = ->
    focusWidget = JAF.app.focusWidget
    if focusWidget?
      focusWidget.fireBlur()
      JAF.app.focusWidget = null
)()
