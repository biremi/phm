###
JAF.ui.Control class
###
(->
  exports = this
  class Control
    constructor: (element) ->
      @elementId = "#{@type}-#{JAF.utils.generateUniqId()}"
      @parseProperties(element) if @parseProperties?
      @params = {}

    replace: (placeholder) ->
      html = @renderView()
      classes = placeholder.attr('class')
      placeholder.replaceWith(html)
      @postInit() if @postInit?
      @getElement().addClass(classes)

    fireEvent: (eventName, data=null) ->
      JAF.eventsDispatcher.handleControlEvent(this, eventName, data)

    # System helpers
    uniqueId: ->
      "control-#{@parentWidget.className}-#{@parentWidget.contextId}-#{@name}"

  # Common framework part
  JAF.utils.include(Control, JAF.ui.Element)
  JAF.utils.include(Control, JAF.ui.CommonWidget)
  exports.JAF.ui.Control = Control
  false
)()
