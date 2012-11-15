###
PHM.app module
###
(->
  exports = this

  # Init part
  self = exports.PHM.app =
    widgetClasses: {}
    widgets: {}
    models: {}
    db: {}
    behaviors: {}
    css_behaviors: {}
    eventsList:
      "comet": {}
      "area": {}
      "widget": {}
      "control": {}
    focusWidget: null

  # Widgets methods
  # public            
  self.hasWidget = (className, contextId) ->
    collection = self.widgets[className]
    collection? and collection[contextId]?

  self.registerWidgetClass = (className, widgetClass, viewPath = null) ->
    self.widgetClasses[className] = widgetClass
    widgetClass::className = className
    widgetClass::viewPath = viewPath || className

  self.addWidget = (className, contextId, placeholder, params) ->
    checkWidgetClass(className)
    validateWidgetContext(className, contextId)
    checkRegisteredWidget(className, contextId)
    widget = createWidget(className, contextId, params)
    widget.appendTo(placeholder, params?.prepend)
    registerWidget(widget, contextId)
    widget.postInit() if widget.postInit?
    widget

  self.addSingletonWidget = (className, placeholder, params) ->
    checkWidgetClass(className)
    checkRegisteredSingletonWidget(className)
    widget = createWidget(className, "singleton", params)
    widget.appendTo(placeholder, params?.prepend)
    registerSingletonWidget(widget)
    widget.postInit() if widget.postInit?
    widget

  self.removeWidget = (className, contextId) ->
    widget = self.getWidget(className, contextId)
    if widget?
      widget.removeChildren()
      widget.remove()
      unregisterWidget(widget)
      removeFromParentWidget(widget)
      delete widget

  self.removeSingletonWidget = (className) ->
    widget = self.getSingletonWidget(className)
    if widget?
      widget.remove()
      unregisterSingletonWidget(widget)
      removeFromParentWidget(widget)
      delete widget

  self.removeClassWidgets = (className) ->
    _(PHM.app.widgets[className]).each (widget) ->
      PHM.app.removeWidget(widget.className, widget.contextId)

  
  self.getWidget = (className, contextId) ->
    self.widgets[className]?[contextId]

  self.getSingletonWidget = (className) ->
    self.widgets[className]

  self.withWidget = (className, contextId, callback) ->
    widget = self.getWidget(className, contextId)
    callback.call(widget) if widget?

  self.withSingletonWidget = (className, callback) ->
    widget = self.getSingletonWidget(className)
    callback.call(widget) if widget?

  self.blurredAt = new Date()
  self.lastBlurredTime = 0
  
  self.observeBlurredTime = () ->
    $(window).blur ->
      self.blurredAt = new Date()
      self.lastBlurredTime = 0

    $(window).focus ->
      now = new Date()
      self.lastBlurredTime = now.getTime() - self.blurredAt.getTime()

  # private
  createWidget = (className, contextId, params) ->
    widgetClass = self.widgetClasses[className]
    widget = new widgetClass(contextId, params)

  checkWidgetClass = (className) ->
    widgetClass = self.widgetClasses[className]
    if !widgetClass?
      PHM.throwException("widgetClass", "#{className} not found in application")

  validateWidgetContext = (className, contextId) ->
    if !contextId?
      PHM.throwException("widget", "can't add widget #{className} without contextId")
    widgetClass = self.widgetClasses[className]
    widgetClass.validateContext(contextId) if widgetClass.validateContext?

  checkRegisteredWidget = (className, contextId) ->
    collection = self.widgets[className]
    if collection? and collection[contextId]?
      PHM.throwException("widget", "#{className}, id: #{contextId} already registered in app")

  checkRegisteredSingletonWidget = (className) ->
    if self.widgets[className]?
      PHM.throwException("widget", "singleton #{className} already registered in app")

  registerWidget = (widget, contextId) ->
    if !self.widgets[widget.className]?
      self.widgets[widget.className] = {}
    self.widgets[widget.className][contextId] = widget

  registerSingletonWidget = (widget) ->
    self.widgets[widget.className] = widget

  unregisterWidget = (widget) ->
    delete self.widgets[widget.className][widget.contextId]

  unregisterSingletonWidget = (widget) ->
    delete self.widgets[widget.className]

  removeFromParentWidget = (widget) ->
    if widget.parentWidget?
      parent = widget.parentWidget
      idx = _(parent.children).indexOf(widget)
      parent.children.splice(idx, 1) if idx?
)()
