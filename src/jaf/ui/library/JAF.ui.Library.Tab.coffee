###
 Library::Tab class
###
(->
  class Tab extends JAF.ui.Control
    parseProperties: (element) ->
      @text = $(element).attr('text')
      @label = $(element).attr('label')

    prepareRenderParams: ->
      params = 
        text: @text
        label: @label

    postInit: ->
      @bindClick()

  # framework initializing stuff
  JAF.ui.registerLibraryElement("tab", Tab)
)()
