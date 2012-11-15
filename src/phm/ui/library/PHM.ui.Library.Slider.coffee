###
 Library::Slider class
###
(->
  class Slider extends PHM.ui.Control
    @fireEventTimeout = 200

    parseProperties: (element) ->
      @template = $(element).attr('template')
      @minValue = Number($(element).attr('minvalue'))
      @maxValue = Number($(element).attr('maxvalue'))
      if $(element).attr('step')?
        @step = Number($(element).attr('step'))
      else
        @step = 1

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
        differenceX = @getTrackPositionDifference(event)
        toMove = @moveOnClick(differenceX)
        @onTrackPositionMoved(toMove)

    trackMoveHandler: (event) ->
      @movedBuffer += @getTrackPositionDifference(event)
      @saveLastTrackPosition(event)
      valueChange = @movedValue(@movedBuffer)
      if Math.abs(valueChange) >= @step
        @updateMovedBuffer(valueChange)
        @onTrackPositionMoved(valueChange)

    updateMovedBuffer: (valueChange) ->
      move = Math.round(valueChange * @sliderWidth() / (@step * @valueInterval())) * @step
      @movedBuffer -= move

    updateTrackPosition: ->
      @lastTrackPosition = @getChildElement('track').offset()?.left + 7

    saveLastTrackPosition: (event) ->
      @lastTrackPosition = event.pageX

    getTrackPositionDifference: (event) ->
      @lastTrackPosition - event.pageX

    onTrackPositionMoved: (valueChange)->
      @setValue(@value - valueChange)
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
      @value = refinedValue
      @setTrackPosition(refinedValue)
      @setTooltipValue(refinedValue)
      @updateTrackPosition()

    getValue: ->
      @value

    getTrackPosition: ->
      position = @getChildElement('track').css('right')
      Number(position.replace(/px/, ''))

    setTrackPosition: (value) ->
      completePercentage = @completePercentage(value)
      @getChildElement('track').css('right', '-18px')
      @getChildElement('completed').width("#{completePercentage}%")

    setTooltipValue: (value) ->
      @setChildElementText('tooltip', value)

    refineValue: (value) ->
      refinedValue = value
      refinedValue = @minValue if value < @minValue
      refinedValue = @maxValue if value > @maxValue
      refinedValue

    valueInterval: ->
      @maxValue - @minValue

    completePercentage: (value) ->
      completePercentage = (value - @minValue) * 100 / @valueInterval()

    movedValue: (moved) ->
      Math.round(moved * @valueInterval() / (@step * @sliderWidth())) * @step

    moveOnClick: (difference) ->
      if difference > 0
        @step
      else
        -@step

    sliderWidth: ->
      @getChildElement('scrollbar').width()

  PHM.ui.registerLibraryElement("slider", Slider)
)()
