###
PHM.ui.Widget class
###
exports = this
class Widget
  # Common methods
  constructor: (contextId, params) ->
    @contextId = contextId
    @params = params
    @elementId = "#{@className}-#{@contextId}"
    @children = []

  appendTo: (placeholder, prepend=false) ->
    html = @renderView()
    if prepend
      placeholder.prepend(html)
    else
      placeholder.append(html)
    @addLibraryElements()

  # Widgets methods
  addWidget: (className, contextId, jsClass, params = null) ->
    placeholder = PHM.ui.getSelector(jsClass, @elementId)
    widget = PHM.app.addWidget(className, contextId, placeholder, params)
    @children.push(widget)
    widget

  addSingletonWidget: (className, jsClass, params = null) ->
    placeholder = PHM.ui.getSelector(jsClass, @elementId)
    widget = PHM.app.addSingletonWidget(className, placeholder, params)
  
  removeChildren: ->
    _(@children).each (childWidget) ->
      PHM.app.removeWidget(childWidget.className, childWidget.contextId)

  # Library methods
  addLibraryElements: () ->
    libraryElements = findLibraryElements(@getElement())
    @addLibraryElement($(element)) for element in libraryElements

  addLibraryElement: (placeholder) ->
    type = placeholder.attr('type')
    name = placeholder.attr('name')
    checkIfNameTaken(this, name)
    @createLibraryElement(name, type, placeholder)

  createLibraryElement: (name, type, placeholder) ->
    element = PHM.ui.addLibraryElement(type, placeholder)
    this[name] = element
    element.name = name
    element.parentWidget = this

  appendView: (jsClass, viewPath, params) ->
    placeholder = PHM.ui.getSelector(jsClass, @elementId)
    PHM.ui.appendView(viewPath, placeholder, params)

  # Events methods
  fireEvent: (eventName, data=null) ->
    PHM.eventsDispatcher.handleWidgetEvent(this, eventName, data)

  # System helpers
  uniqueId: ->
    "widget-#{@className}-#{@contextId}"

# Helper methods
findLibraryElements = (element) ->
  element.find('uilibrary')

checkIfNameTaken = (widget, name) ->
  if widget[name]?
    PHM.throwException("widget", "element with name: #{name} already taken in #{widget.elementId}")

# Common framework part
PHM.utils.include(Widget, PHM.ui.Element)
PHM.utils.include(Widget, PHM.ui.CommonWidget)
exports.PHM.ui.Widget = Widget
