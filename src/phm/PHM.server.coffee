###
PHM.server module
###
(->
  exports = this
  self = exports.PHM.server = {}

  ###
  Common API
  ###
  self.doPostCall = (params) -> 
    PHM.server.doAJAXCall('POST', params)

  self.doPutCall = (params) ->
    PHM.server.doAJAXCall('PUT', params)

  self.doGetCall = (params) ->
    PHM.server.doAJAXCall('GET', params)

  self.doDeleteCall = (params) ->
    PHM.server.doAJAXCall('DELETE', params)

  self.parseResponse = (text) ->
    $.parseJSON(text)

  self.doAJAXCall = (type, params) ->
    params.dataType = 'html' if !params.dataType
    $.ajax
      type: type,
      url: params.url,
      dataType: params.dataType,
      data: params.data,
      success: buildSuccessCallback(params),
      error: buildErrorCallback(params)

  ###
  Common Helpers
  ###
  buildSuccessCallback = (params) ->
    (data, text_status) ->
      if params.dataType == 'json' || params.dataType == 'jsonp'
        response = data
      else if params.dataType == 'script'
        response = {status: text_status}
      else if params.dataType == 'text'
        response = data
      else
        response = PHM.server.parseResponse(data)
      PHM.log.info(response)
      switch response.status
        when "ok"
          if response.message? and response.message is 'system_logout'
            document.location = response.data.url
          params.success(response) if params.success
        when "success"
          params.success()
        when "error"
          PHM.log.error(response)
          params.error(response) if params.error
        else
          PHM.log.info("Unexpected status: " + response.status)

  buildErrorCallback = (params) ->
    (data) ->
      options = {status: 'error', message: 'Critical server error', data: ''}
      PHM.log.error(params)
      params.error(options) if params.error
)()
