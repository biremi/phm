###
 Library::DatePicker class
###
(->
  class DatePicker extends PHM.ui.Control

    parseProperties: (element) ->
      @template = $(element).attr('template')
      @isShort = $(element).attr('short') is 'true'

    postInit: ->
      @year = @getChildElement('year')
      @month = @getChildElement('month')
      @day = @getChildElement('day')
      @bindEvents()
      
    prepareRenderParams: ->
      params = 
        years: [1999..1920]
        months: monthList(@isShort)
        days: [1..31]

    showError: (error) ->
      switch error
        when 'cant_be_nil'
          @showNilValueError()
        else
          errorMessage = PHM.utils.errorMessage.get(@name, error)
          @showAllFieldsError(errorMessage)

    showNilValueError: ->
      @hideError()
      _(@fields()).each (field) =>
        if @[field].val() is '-1'
          @showFieldError(field, "Select #{field} please")

    showAllFieldsError: (text) ->
      _(@fields()).each (field) =>
        @showFieldError(field, text)

    showFieldError: (field, text) ->
      @addChildElementClass("#{field}-label", 'is-error')
      @setChildElementText("#{field}-error-text", text)

    hideFieldError: (field) ->
      @removeChildElementClass("#{field}-label", 'is-error')

    hideError: ->
      _(@fields()).each (field) =>
        @hideFieldError(field)

    fields: ->
      ['day', 'month', 'year']
        
    getValue: -> 
      # NEED TO CREATE UN element datapicker and get value from it!!!!
      if @year.val() == '-1' || @month.val() == '-1' || @day.val() == '-1'
        ''
      else
        @day.val() + "-" + @month.val() + "-" + @year.val()

     bindEvents: ->
       _(@fields()).each (field) =>
         @bindFieldFocus(field)
         @bindFieldFocusin(field)
         @bindFieldChange(field)
     
     isFilled: ->
       _(@fields()).all (field) =>
         return @[field].val() isnt '-1'

     hasValue: ->
       _(@fields()).any (field) =>
         return @[field].val() isnt '-1'

     bindFieldFocus: (field) ->
       select = @getChildElement(field)
       select.focus =>
         caption = @getChildElement("#{field}").find("option[value=-1]")
         caption.remove()

     bindFieldFocusin: (field) ->
       select = @getChildElement(field)
       select.focusin (event) =>
         if @hasFocus
           event.stopPropagation()
         else
           @setFocus()

     bindFieldChange: (field) ->
       select = @getChildElement(field)
       select.change =>
          @fireEvent("value_changed") if @isFilled()

  monthList = (isShort) ->
    months =
      1: 'January'
      2: 'February'
      3: 'March'
      4: 'April'
      5: 'May'
      6: 'June'
      7: 'July'
      8: 'August'
      9: 'September'
      10: 'October'
      11: 'November'
      12: 'December'
    if isShort is true
      _(months).each (value, key) ->
        months[key] = value.slice(0, 3)
    return months

  PHM.ui.registerLibraryElement("date_picker", DatePicker)
)()
