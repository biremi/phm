###
 Library::Button class
###
class Button extends PHM.ui.Control
  # common control methods if needed goes here
  parseProperties: (element) ->
    @defaultText = $(element).attr('text')
    @removeDefaultClass = $(element).attr('remove-default-class')
    @template = $(element).attr('template')

  prepareRenderParams: ->
    {text: @defaultText}

  postInit: ->
    @bindClick( -> @startLoading())
    @removeClass('button') if @removeDefaultClass

  setText: (text) ->
    @setChildElementText('text', text)

# framework initializing stuff
PHM.ui.registerLibraryElement("button", Button)
