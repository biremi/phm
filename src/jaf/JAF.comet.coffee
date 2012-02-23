###
JAF.comet module
###
(->
  exports = this
  self = exports.JAF.comet = {}
  self.client = null

  self.on = (eventName, handler) ->
    JAF.eventsDispatcher.onComet(eventName, handler)

  self.dispatchEvent = (eventName, data) ->
    JAF.eventsDispatcher.handleCometEvent(eventName, data)
  
  self.init = (host, port, channel) ->
    self.client = new JAF.comet.Client()
    self.client.connect(host, port, channel)
  
  self.disconnect = ->
    JAF.log.info "started comet disconnection"
    try
      JAF.comet.client.disconnect()
      JAF.log.info "disconnection: closing connection"
    catch e
      JAF.log.info "ERROR on disconnect: #{e.name} : #{e.message}"
)()

(->
  exports = this
  class Client
    constructor: ->
      @sockets = []
      @transports = []

    connect: (host, port, channel) ->
      portPart = (if Number(port) is 80 then "" else ":#{port}")
      url = "http://#{host}#{portPart}"
      JAF.log.info "Comet url:#{url}"
      if typeof io is "undefined"
        JAF.log.error "Comet isn't activated"
        return
      @sio = @initSocketIO(url, authQuery: "sio_channel=#{channel}")

    disconnect: ->
      JAF.log.info "do disconnect"
      @sio.disconnect() if @sio

    initSocketIO: (url, details) ->
      self = this
      socket = io.connect(url, details)
      JAF.log.info "Current socket.id: " + socket.socket.sessionid
      JAF.log.info socket
      socket.on "connect", ->
        self.sockets.push socket.socket
        self.transports.push socket.socket.transport
        JAF.log.info "Connected to comet-server(" + socket.socket.sessionid + ")"
        JAF.log.info socket

      socket.on "message", (msg) ->
        JAF.log.info "SessionID: " + socket.socket.sessionid
        JAF.log.info "Message(Q): " + msg
        try
          nameWithData = jQuery.parseJSON(msg)
          JAF.comet.dispatchEvent nameWithData[0], nameWithData[1]
        catch e
          JAF.log.error "ERROR evaluating frame body: " + e.name + ":" + e.message
          JAF.log.info e
          JAF.log.info "on msg: " + msg
          #TODO: add airbrake support
          #JAF.common.deliverFrameException e, msg

      socket.on "reconnect", ->
        JAF.log.info "Comet: Reconnected to the server"
        JAF.log.info "Current socket.id: " + socket.socket.sessionid
        JAF.log.info socket

      socket.on "reconnecting", ->
        JAF.log.info "Comet: Attempting to re-connect to the server"

      socket.on "disconnect", ->
        JAF.log.info "Comet: sio was disconnected"

      socket.on "error", (e) ->
        JAF.log.info e
        JAF.log.error "Comet", (if e then e else "An unknown error occurred")

      socket

  exports.JAF.comet.Client = Client
)()
