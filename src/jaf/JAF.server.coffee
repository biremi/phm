###
JAF.server module
###
(->
  exports = this
  self = exports.JAF.server = {}

  ###
  Common API
  ###
  self.doPostCall = (params) -> 
    JAF.server.doAJAXCall('POST', params)

  self.doPutCall = (params) ->
    JAF.server.doAJAXCall('PUT', params)

  self.doGetCall = (params) ->
    JAF.server.doAJAXCall('GET', params)

  self.doDeleteCall = (params) ->
    JAF.server.doAJAXCall('DELETE', params)

  self.parseResponse = (text) ->
    $.parseJSON(text)

  self.doAJAXCall = (type, params) ->
    params.dataType = 'html' if !params.dataType
    $.ajax({
      type: type,
      url: params.url,
      dataType: params.dataType,
      data: params.data,
      success: buildSuccessCallback(params),
      error: buildErrorCallback(params)
    })

  ###
  Common Helpers
  ###
  buildSuccessCallback = (params) ->
    (data) ->
      if params.dataType == 'json' || params.dataType == 'jsonp'
        response = data
      else
        response = JAF.server.parseResponse(data)
      JAF.log.info(response)
      switch response.status
        when "ok"
          params.success(response) if params.success
        when "error"
          JAF.log.error(response.message)
          params.error(response) if params.error
        else
          JAF.log.info("Unexpected status: " + response.status)

  buildErrorCallback = (params) ->
    (data) ->
      options = {status: 'error', message: 'Critical server error', data: ''}
      JAF.log.error(params)
      params.error(options) if params.error
)()
