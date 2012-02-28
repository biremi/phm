###
PHM.ui.Control class
###
exports = this
class Control
  constructor: (element) ->
    @elementId = "#{@type}-#{PHM.utils.generateUniqId()}"
    @parseProperties(element) if @parseProperties?
    @template = $(element).attr('template')
    @params = {}

  replace: (placeholder) ->
    html = @renderView()
    classes = placeholder.attr('class')
    placeholder.replaceWith(html)
    @postInit() if @postInit?
    @getElement().addClass(classes)

  fireEvent: (eventName, data=null) ->
    PHM.eventsDispatcher.handleControlEvent(this, eventName, data)

# Common framework part
PHM.utils.include(Control, PHM.ui.Element)
PHM.utils.include(Control, PHM.ui.CommonWidget)
exports.PHM.ui.Control = Control
