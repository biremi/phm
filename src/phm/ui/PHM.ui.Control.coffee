###
PHM.ui.Control class
###
(->
  exports = this
  class Control
    constructor: (element) ->
      @elementId = "#{@type}-#{PHM.utils.generateUniqId()}"
      @parseProperties(element) if @parseProperties?
      @parseCommonProperties(element)
      @params = {}

    parseCommonProperties: (element) ->
      @keepChildren = $(element).attr('keepChildren')

    replace: (placeholder) ->
      html = @renderView()
      classes = placeholder.attr('class')
      contents = $(placeholder).html()
      placeholder.replaceWith(html)
      @getElement().append(contents) if @keepChildren
      @postInit() if @postInit?
      @getElement().addClass(classes)

    fireEvent: (eventName, data=null) ->
      PHM.eventsDispatcher.handleControlEvent(this, eventName, data)

    # System helpers
    uniqueId: ->
      "control-#{@parentWidget.className}-#{@parentWidget.contextId}-#{@name}"

  # Common framework part
  PHM.utils.include(Control, PHM.ui.Element)
  PHM.utils.include(Control, PHM.ui.CommonWidget)
  exports.PHM.ui.Control = Control
  false
)()
