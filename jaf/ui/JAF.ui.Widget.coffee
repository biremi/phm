###
JAF.ui.Widget class
###
(->
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
      placeholder = JAF.ui.getSelector(jsClass, @elementId)
      widget = JAF.app.addWidget(className, contextId, placeholder, params)
      @children.push(widget)
      widget

    addSingletonWidget: (className, jsClass, params = null) ->
      placeholder = JAF.ui.getSelector(jsClass, @elementId)
      widget = JAF.app.addSingletonWidget(className, placeholder, params)
    
    removeChildren: ->
      _(@children).each (childWidget) ->
        JAF.app.removeWidget(childWidget.className, childWidget.contextId)

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
      element = JAF.ui.addLibraryElement(type, placeholder)
      this[name] = element
      element.name = name
      element.parentWidget = this

    appendView: (jsClass, viewPath, params) ->
      placeholder = JAF.ui.getSelector(jsClass, @elementId)
      JAF.ui.appendView(viewPath, placeholder, params)

    # Events methods
    fireEvent: (eventName, data=null) ->
      JAF.eventsDispatcher.handleWidgetEvent(this, eventName, data)

    # System helpers
    uniqueId: ->
      "widget-#{@className}-#{@contextId}"

  # Helper methods
  findLibraryElements = (element) ->
    element.find('uilibrary')

  checkIfNameTaken = (widget, name) ->
    if widget[name]?
      JAF.throwException("widget", "element with name: #{name} already taken in #{widget.elementId}")

  # Common framework part
  JAF.utils.include(Widget, JAF.ui.Element)
  JAF.utils.include(Widget, JAF.ui.CommonWidget)
  exports.JAF.ui.Widget = Widget
  false
)()
