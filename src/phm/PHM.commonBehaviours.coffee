###
PHM.commonBehaviours module
###
(->
  exports = this
  self = exports.PHM.commonBehaviours = {}

  self.isLightbox = (widgetClassName) ->
    klass = PHM.app.widgetClasses[widgetClassName]
    if klass?
      klass::blurOnEscape = true
      klass::show = -> @setFocus(); super()
      klass::hide = -> @removeFocus(); super()

    PHM.events.onControl widgetClassName, 'overlayLabel', 'click', ->
      @parentWidget.hide()
    PHM.events.onControl widgetClassName, 'closeButton', 'click', ->
      @parentWidget.hide()
      @stopLoading()
    PHM.events.onWidget widgetClassName, 'blur', -> @hide()
)()
