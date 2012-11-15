###
 Library::Checkbox class
###
(->
  class Checkbox extends PHM.ui.Control
    parseProperties: (element) ->
      @label = $(element).attr('label')
      @checked = $(element).attr('checked') or false
      @template = $(element).attr('template')
      @toggleClass = $(element).attr('toggle-class') || 'selected'

    prepareRenderParams: ->
      {label: @label}

    postInit: ->
      @bindEvents()
      @check() if @checked

    setLable: (label) ->
      @setChildElementText('label', label)

    bindEvents: ->
      @getElement().click =>
        @toggleCheck(true)

    toggleCheck: (auto=false) ->
      if @isChecked() then @uncheck() else @check()
      @fireEvent('state-changed') if auto

    isChecked: ->
      @hasClass(@toggleClass)

    check: ->
      @addClass(@toggleClass)

    uncheck: ->
      @removeClass(@toggleClass)

  PHM.ui.registerLibraryElement("checkbox", Checkbox)
)()
