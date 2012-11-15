###
 Library::ButtonWithTooltip class
###
(->
  class ButtonWithTooltip extends PHM.ui.Library.button
    # common control methods if needed goes here
    parseProperties: (element) ->
      @tooltipText = $(element).attr('tooltip')
      super(element)

    postInit: ->
      @setTooltip(@tooltipText)
      super()

    prepareRenderParams: ->
      text: @defaultText
      tooltipText: @tooltipText

    setTooltip: (text) ->
      if text == ''
        @hideChildElement('tooltip')
      else
        refined = PHM.utils.number.shorten(text)
        @setChildElementText('tooltip', refined)
        @showChildElement('tooltip')

  # framework initializing stuff
  PHM.ui.registerLibraryElement("button_with_tooltip", ButtonWithTooltip)
)()
