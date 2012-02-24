###
 Library::Slider class
###
class Slider extends PHM.ui.Control
  @fireEventTimeout = 200

  parseProperties: (element) ->
    @minValue = Number($(element).attr('minvalue'))
    @maxValue = Number($(element).attr('maxvalue'))

  postInit: ->
    @movedBuffer = 0
    @updateTrackPosition()
    @bindMouseUpDown()
    @bindClick()

  bindMouseUpDown: ->
    handler = (event) => @trackMoveHandler(event)
    @getChildElement('track').mousedown (event) =>
      return if @isDisabled()
      event.preventDefault()
      @movedBuffer = 0
      @saveLastTrackPosition(event)
      @clickDisabled = true
      $(document).mousemove(handler)

    $(document).mouseup =>
      $(document).unbind('mousemove', handler)
      @clickDisabled = false

  bindClick: ->
    @getElement().click (event) =>
      return if @isDisabled()
      toMove = event.pageX - @lastTrackPosition
      normalizedToMove = @movedValue(-toMove)
      @onTrackPositionMoved(normalizedToMove)
      @saveLastTrackPosition(event)
      console.log(@clickDisabled + ' click ' + event.offsetX + ' to move: ' + toMove)

  trackMoveHandler: (event) ->
    @movedBuffer += @getTrackPositionDifference(event)
    @saveLastTrackPosition(event)
    valueChange = @movedValue(@movedBuffer)
    if Math.abs(valueChange) >= 1
      @updateMovedBuffer(valueChange)
      @onTrackPositionMoved(valueChange)

  updateMovedBuffer: (valueChange) ->
    move = Math.round(valueChange * @sliderWidth() / @valueInterval())
    @movedBuffer -= move

  updateTrackPosition: ->
    @lastTrackPosition = @getChildElement('track').offset()?.left + 7

  saveLastTrackPosition: (event) ->
    @lastTrackPosition = event.pageX

  getTrackPositionDifference: (event) ->
    @lastTrackPosition - event.pageX

  onTrackPositionMoved: (valueChange)->
    console.log('change: ' + valueChange)
    @setValue(@getValue() - valueChange)
    unless @moveEventFireTimer?
      @moveEventFireTimer = setTimeout =>
        @fireEvent('value_changed')
        clearTimeout(@moveEventFireTimer)
        delete @moveEventFireTimer
      , Slider.fireEventTimeout

  setLimits: (min, max) ->
    @minValue = Number(min)
    @maxValue = Number(max)

  setValue: (value) ->
    refinedValue = @refineValue(value)
    @setTrackPosition(refinedValue)
    @setTooltipValue(refinedValue)
    @updateTrackPosition()

  getTrackPosition: ->
    position = @getChildElement('track').css('right')
    Number(position.replace(/px/, ''))

  setTrackPosition: (value) ->
    completePercentage = @completePercentage(value)
    @getChildElement('track').css('right', '-8px')
    @getChildElement('completed').width("#{completePercentage}%")

  setTooltipValue: (value) ->
    @setChildElementText('tooltip', value)

  refineValue: (value) ->
    refinedValue = value
    refinedValue = @minValue if value < @minValue
    refinedValue = @maxValue if value > @maxValue
    Math.round(refinedValue)

  valueInterval: ->
    @maxValue - @minValue

  getValue: ->
    @getChildElementText('tooltip')

  completePercentage: (value) ->
    completePercentage = (value - @minValue) * 100 / @valueInterval()

  movedValue: (moved) ->
    Math.round(moved * @valueInterval() / @sliderWidth())

  sliderWidth: ->
    @getChildElement('scrollbar').width()

PHM.ui.registerLibraryElement("slider", Slider)
