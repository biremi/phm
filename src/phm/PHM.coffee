(->
  exports = this
  exports.PHM = {} if !exports.PHM
  self = exports.PHM
  self.WINDOW_FOCUSED = document.hasFocus?()

  self.initApp = ->
    self.initBlurHandler()
    self.initEscHandler()
    self.initWindowFocus()

  self.initBlurHandler = ->
    # For not-focusable elements
    # Emulating
    $(document).click (e) ->
      if (!$.browser.msie and e.button == 0) or ($.browser.msie && e.button == 1)
        self.processBlur()
    
    # For focusable elements
    $(document).focusin (event) ->
      self.processBlur()

  self.initEscHandler = ->
    $(document).keyup (e) ->
      if e.which is PHM.ui.escapeKeyCode
        self.processEsc()

  self.initWindowFocus = ->
    $(window).focus ->
      self.WINDOW_FOCUSED = true
      PHM.utils.stopBlinkTitle()

    $(window).blur ->
      self.WINDOW_FOCUSED = false

  self.throwException = (type, text) ->
    throw "PHM Exception (#{type}): #{text}"

  self.processBlur = ->
    focusWidget = PHM.app.focusWidget
    if focusWidget?
      focusWidget.fireBlur()
      PHM.app.focusWidget = null

  self.processEsc = ->
    focusWidget = PHM.app.focusWidget
    if focusWidget? && focusWidget.blurOnEscape
      focusWidget.fireBlur()
      PHM.app.focusWidget = null

  self.requestAnimationFrame = (callback) ->
    fn =  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          (job) ->
            setTimeout(->
              job(Date.now())
            , 0)
    fn.call(window, callback)

  self.doAsync = (callback) ->
    setTimeout(->
      callback.call()
    , 0)

)()
