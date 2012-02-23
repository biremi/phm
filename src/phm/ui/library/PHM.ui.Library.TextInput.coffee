###
 Library::TextInput class
###
(->
  class TextInput extends PHM.ui.Control
    parseProperties: (element) ->
      @defaultValue = $(element).attr('default')
      @template = $(element).attr('template')
      @maxLength = $(element).attr('maxlength')
      @predefinedValue = $(element).attr('value')

    prepareRenderParams: ->
      {maxLength: @maxLength}

    postInit: ->
      @setDefaultValue()
      if @predefinedValue? then @setValue(@predefinedValue)
      @bindEvents()

    bindEvents: ->
      input = @getChildElement('input')
      input.unbind()
      @bindInputFocus(input)
      @bindInputBlur(input)

    bindInputFocus: (input) ->
      input.focus =>
        @removeDefaultValue()
        @setFocus()

    bindInputBlur: (input) ->
      input.blur =>
        @setDefaultValue()

    removeDefaultValue: ->
      if @getChildElementValue('input') is @defaultValue
        @setValue('')
      @removeIdle()

    setDefaultValue: ->
      if @getChildElementValue('input') is ''
        @setChildElementValue('input', @defaultValue)
        @setIdle()

    setValue: (value) ->
      @setChildElementValue('input', value)

    getValue: ->
      rawValue = @getChildElementValue('input')
      value = $.trim(rawValue)
      if value is @defaultValue then '' else value

    bindValueChange: (callback=null) ->
      input = @getChildElement('input')
      input.keydown =>
        @processValueChange(callback)

    processValueChange: (callback) ->
      prevValue = @getValue()
      setTimeout =>
        if prevValue isnt @getValue()
          callback.call(@) if callback?
          @fireEvent("value_changed")
      , 1

    bindSubmit: (callback=null) ->
      input = @getChildElement('input')
      input.keypress (e) =>
        if e.which is PHM.ui.enterKeyCode
          callback.call(@) if callback?
          @fireEvent("submit")

    disable: ->
      @getChildElement('input').attr('disabled', true)
      super()

    enable: ->
      @getChildElement('input').attr('disabled', false)
      super()

  PHM.ui.registerLibraryElement("text_input", TextInput)
)()
