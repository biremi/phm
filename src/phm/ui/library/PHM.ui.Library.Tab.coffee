###
 Library::Tab class
###
class Tab extends PHM.ui.Control
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
PHM.ui.registerLibraryElement("tab", Tab)
