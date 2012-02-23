###
 Library::Label class
###
(->
  class Label extends JAF.ui.Control
    # common control methods if needed goes here
    parseProperties: (element) ->
      @text = $(element).attr('text')
      @template = $(element).attr('template')

    prepareRenderParams: ->
      {text: @text}

    postInit: ->
      @bindClick()

    setText: (txt) ->
      @getElement().html(txt)

  # framework initializing stuff
  JAF.ui.registerLibraryElement("label", Label)
  false
)()
