###
PHM.eventsDispatcher module
###
exports = this
self = exports.PHM.eventsDispatcher = {}
exports.PHM.events = self # short alias
eventsList = PHM.app.eventsList

# public API
self.fireAreaEvent = (eventName, data) ->
  handleAreaEvent(eventName, data)

self.onArea = (eventName, handler) ->
  addAreaEventHandler(eventName, handler)

self.onComet = (eventName, handler) ->
  addCometEventHandler(eventName, handler)

self.onWidget = (widgetClass, eventName, handler) ->
  addWidgetEventHandler(widgetClass, eventName, handler)

self.onControl = (widgetClass, controlName, eventName, handler) ->
  addControlEventHandler(widgetClass, controlName, eventName, handler)

# eventsList part
addCometEventHandler = (eventName, handler) ->
  addEventHandler("comet", eventName, handler)

addAreaEventHandler = (eventName, handler) ->
  addEventHandler("area", eventName, handler)

addWidgetEventHandler = (widgetClass, eventName, handler) ->
  eventFullName = widgetEventName(widgetClass, eventName)
  addEventHandler("widget", eventFullName, handler)

addControlEventHandler = (widgetClass, controlName, eventName, handler) ->
  eventFullName = "#{widgetClass}-#{controlName}-#{eventName}"
  addEventHandler("control", eventFullName, handler)

addEventHandler = (eventSource, eventName, handler) ->
  handlers = getEventHandlers(eventSource, eventName)
  if _(handlers).size() is 0
    eventsList[eventSource][eventName] = [handler]
  else
    handlers.push(handler)

# Event handlers part
handleAreaEvent = (eventName, data) ->
  handleSimpleEvent("area", eventName, data)

self.handleCometEvent = (eventName, data) ->
  handleSimpleEvent("comet", eventName, data)

self.handleWidgetEvent = (widget, eventName, data) ->
  eventFullName = widgetEventName(widget.className, eventName)
  handleEvent("widget", widget, eventFullName, data)

self.handleControlEvent = (control, eventName, data) ->
  widgetClass = control.parentWidget.className
  eventFullName = controlEventName(widgetClass, control.name, eventName)
  handleEvent("control", control, eventFullName, data)

# Private methods
getEventHandlers = (eventSource, eventName) ->
  eventsList[eventSource][eventName] || []

widgetEventName = (widgetClass, eventName) ->
  "#{widgetClass}-#{eventName}"

controlEventName = (widgetClass, controlName, eventName) ->
  "#{widgetClass}-#{controlName}-#{eventName}"

handleEvent = (source, caller, name, data=null) ->
  PHM.log.info "Event: caller: #{caller}, source: #{source}, data: #{data}, name: #{name}"
  handlers = getEventHandlers(source, name)
  handler.call(caller, data) for handler in handlers

handleSimpleEvent = (source, name, data=null) ->
  PHM.log.info "Simple event: source: #{source}, data: #{data}, name: #{name}"
  handlers = getEventHandlers(source, name)
  handler.call(null, data) for handler in handlers
