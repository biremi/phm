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
      @setUnreadCount(@unread_count+1)

    setUnreadCount: (count) ->
      @unread_count = count
      @getElement().find('.no-messages').toggleClass('state-hidden', @unread_count>0)
      @getElement().find('.message-received').toggleClass('state-hidden', @unread_count==0)
      @getElement().find('.message-received').text(count)

    postInit: ->
      @bindClick()
      @unread_count = 0

  # framework initializing stuff
  PHM.ui.registerLibraryElement("chat_tab", ChatTab)
)()
