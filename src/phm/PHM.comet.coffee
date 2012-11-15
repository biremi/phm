###
PHM.comet module
###
(->
  exports = this
  self = exports.PHM.comet = {}
  self.client = null

  self.on = (eventName, handler) ->
    PHM.eventsDispatcher.onComet(eventName, handler)

  self.dispatchEvent = (eventName, data) ->
    if self.bufferEvents
      self.addToBuffer(eventName, data)
    else
      self.handleCometEvent(eventName, data)

  self.flushBuffer = ->
    _(self.buffer).each (event) ->
      try
        self.handleCometEvent(event.name, event.data)
      catch error
        PHM.log.error(error)
    self.bufferEvents = false

  self.addToBuffer = (eventName, data) ->
    PHM.log.info "buffered #{eventName}"
    self.buffer.push(name: eventName, data: data)

  self.handleCometEvent = (eventName, data) ->
    setTimeout ->
      PHM.eventsDispatcher.handleCometEvent(eventName, data)
    , 0

  self.init = (host, port, channel) ->
    self.client = new PHM.comet.Client()
    self.client.connect(host, port, channel)
    self.buffer = []
    self.bufferEvents = true

  self.disconnect = ->
    PHM.log.info "started comet disconnection"
    try
      PHM.comet.client.disconnect()
      PHM.log.info "disconnection: closing connection"
    catch e
      PHM.log.info "ERROR on disconnect: #{e.name} : #{e.message}"
)()

#TODO: rewrite in coffee style!
(->
  exports = this
  class Client
    constructor: ->
      @sockets = []
      @transports = []

    connect: (host, port, channel) ->
      port = Number(port)
      portPart = (if port is 80 or port is 443 then "" else ":#{port}")
      protoPart = (if port is 443 then "https:" else "http:")
      url = "#{protoPart}//#{host}#{portPart}"
      PHM.log.info "Comet url:#{url}"
      if typeof io is "undefined"
        PHM.log.error "Comet isn't activated"
        return
      @sio = @initSocketIO(url, authQuery: "sio_channel=#{channel}")

    disconnect: ->
      PHM.log.info "do disconnect"
      @sio.disconnect() if @sio

    initSocketIO: (url, details) ->
      self = this
      socket = io.connect(url, details)
      PHM.log.info "Current socket.id: " + socket.socket.sessionid
      PHM.log.info socket
      socket.on "connect", ->
        self.sockets.push socket.socket
        self.transports.push socket.socket.transport
        PHM.log.info "Connected to comet-server(" + socket.socket.sessionid + ")"
        PHM.log.info socket

      socket.on "message", (msg) ->
        PHM.log.info "SessionID: " + socket.socket.sessionid
        PHM.log.info "Message(Q): " + msg
        try
          nameWithData = jQuery.parseJSON(msg)
          PHM.comet.dispatchEvent nameWithData[0], nameWithData[1]
        catch e
          PHM.log.error "ERROR evaluating frame body: " + e.name + ":" + e.message
          PHM.log.info e
          PHM.log.info "on msg: " + msg
          #TODO: add airbrake support
          #PHM.common.deliverFrameException e, msg

      socket.on "reconnect", ->
        PHM.log.info "Comet: Reconnected to the server"
        PHM.log.info "Current socket.id: " + socket.socket.sessionid
        PHM.log.info socket

      socket.on "reconnecting", ->
        PHM.log.info "Comet: Attempting to re-connect to the server"

      socket.on "disconnect", ->
        PHM.log.info "Comet: sio was disconnected"

      socket.on "error", (e) ->
        PHM.log.info e
        PHM.log.error "Comet", (if e then e else "An unknown error occurred")

      socket

  exports.PHM.comet.Client = Client
)()
