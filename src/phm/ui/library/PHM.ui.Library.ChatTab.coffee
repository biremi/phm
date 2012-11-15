###
 Library::ChatTab class
###
(->
  class ChatTab extends PHM.ui.Control
    parseProperties: (element) ->
      return

    prepareRenderParams: ->
      # TODO unread message count could be here on initial rendering
      params = {} 

    incUnreadCount: ->
      if @unread_count < 99
        @setUnreadCount(@unread_count + 1)
      else
        @setUnreadCount('∞')

    setUnreadCount: (count) ->
      @unread_count = count
      @getElement().toggleClass('is-unread', @unread_count > 0)
      @getSelector('new-chat-messages').toggleClass('state-hidden', @unread_count == 0)
      @getSelector('new-chat-messages').text(count)

    postInit: ->
      @bindClick()
      @unread_count = 0

  # framework initializing stuff
  PHM.ui.registerLibraryElement("chat_tab", ChatTab)
)()
