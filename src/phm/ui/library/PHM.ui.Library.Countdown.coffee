###
 Library::Countdown class
###
(->
  class Countdown extends PHM.ui.Control
    # common control methods if needed goes here
    parseProperties: (element) ->
      @description = $(element).attr('desc')
      @layout = $(element).attr('with_layout')
      @countdownTime = 0

    alreadyStarted: ->
      @countdownTime > 0

    # countdown time in seconds
    start: (countdownTime) ->
      @countdownTime = parseInt(countdownTime)
      countdown = @getChildElement('countdown')
      params = {
        until: '+' + countdownTime + 's', 
        compact: true, 
        description: @description, 
        onExpiry: @fireEndCallback
      }
      if @layout
        layout = @getChildElement('layout')
        params['layout'] = layout.html()
      countdown.countdown(params);

    fireEndCallback: =>
      @stop()
      @fireEvent("countdown_ended")

    stop: ->
      @countdownTime = 0
      countdown = @getChildElement('countdown')
      countdown.countdown('destroy')
      
  # framework initializing stuff
  PHM.ui.registerLibraryElement("countdown", Countdown)
)()
