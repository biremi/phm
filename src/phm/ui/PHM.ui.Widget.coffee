###
PHM.ui.Widget class
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
      @template = @params.template if @params?

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
      widget.parentWidget = @
      widget

    addSingletonWidget: (className, jsClass, params = null) ->
      placeholder = PHM.ui.getSelector(jsClass, @elementId)
      widget = PHM.app.addSingletonWidget(className, placeholder, params)
    
    removeChildren: ->
      childrenInfo = _(@children).map (child) ->
        info =
          className: child.className
          contextId: child.contextId
      _(childrenInfo).each (childInfo) ->
        PHM.app.removeWidget(childInfo.className, childInfo.contextId)

    removeWidget: (className, contextId) ->
      PHM.app.removeWidget(className, contextId)
      @children = _(@children).reject (widget) ->
        (widget.className == className) && (widget.contextId == contextId)


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

    #Behaviors
    defineTabs: (tabs) ->
      if !@tabs?
        @tabs = tabs
      else
        _(tabs).each (value, key) =>
          @tabs[key] = value
      @bindTabs()

    bindTabs: ->
      _(@tabs).each (selector, name) =>
        PHM.events.onControl @className, name, 'click', =>
          @activateTab(name)

    activateTab: (tabName) ->
      _(@tabs).each (selector, name) =>
        if name is tabName
          @[name].addClass('active')
          @showChildElement(selector)
        else
          @[name].removeClass('active')
          @hideChildElement(selector)

    # Events methods
    fireEvent: (eventName, data=null) ->
      PHM.eventsDispatcher.handleWidgetEvent(this, eventName, data)

    # System helpers
    uniqueId: ->
      "widget-#{@className}-#{@contextId}"

    appendView: (selector, templateName, params={})->
      html = PHM.ui.renderView(templateName, params)
      placeholder = @getChildElement(selector)
      placeholder.append(html)

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
  false
)()
