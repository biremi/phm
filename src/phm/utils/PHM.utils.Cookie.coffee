###
PHM.utils.Cookie module
###
(->
  exports = this
  self = exports.PHM.utils.Cookie = {}

  self.set = (name, value, seconds) ->
    expires = calculateExpireTime(seconds)
    domain = ";domain=." + getDomain()
    document.cookie = name + "=" + value + domain + expires + "; path=/"

  self.get = (name) ->
    name += "="
    for cookie in document.cookie.split(';')
      cookie = $.trim(cookie)
      if cookie.indexOf(name) == 0
        return cookie.substring(name.length, cookie.length) 
    return null

  self.delete = (name) ->
    self.set(name, "", -60*60*24)

  calculateExpireTime = (seconds) ->
    return "" unless seconds
    date = new Date
    date.setTime(date.getTime() + (seconds*1000))
    "; expires=" + date.toGMTString()

  getDomain = ->
    window.location.hostname.replace(/([a-zA-Z0-9/-]+.)/,"")

)()
