###
 Library::Label class
###
(->
  class Label extends PHM.ui.Control
    # common control methods if needed goes here
    parseProperties: (element) ->
      @text = $(element).attr('text')
      @template = $(element).attr('template')
      @block = $(element).attr('block')

    prepareRenderParams: ->
      {text: @text, block: @block}

    postInit: ->
      @bindClick()

    setText: (txt) ->
      @getElement().html(txt)

  # framework initializing stuff
  PHM.ui.registerLibraryElement("label", Label)
  false
)()
