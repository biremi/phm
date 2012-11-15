###
 Library::ToggleTab class
###
(->
  class ToggleTab extends PHM.ui.Control
    parseProperties: (element) ->
      @text = $(element).attr('text')
      @label = $(element).attr('label')
      @state = !!$(element).attr('state')

    prepareRenderParams: ->
      params = 
        text: @text
        label: @label
        stateClass: @stateClass()

    toggle: (state) ->
      if arguments.length==0
        @state = !@state
      else
        @state = !!state
      @getElement().toggleClass('is-pressed', @state)

    stateClass: ->
      if @state then 'is-pressed' else ''

    postInit: ->
      @bindClick()

  # framework initializing stuff
  PHM.ui.registerLibraryElement("toggle_tab", ToggleTab)
)()
