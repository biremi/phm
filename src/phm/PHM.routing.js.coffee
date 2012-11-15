###
PHM.routing module
Based on jquer-bbq-plugin: http://benalman.com/projects/jquery-bbq-plugin/
###

(->
  exports = this
  self = exports.PHM.routing = {}
  # Stores route names and navigation callbacks: functions that prepare UI for page 
  namedParam    = /:\w+/g
  splatParam    = /\*\w+/g
  escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g
  self.routes = []
  self.rootUrl = null
  self.redirectStack = []
  self.redirectStackDepthLimit = 2

  # public
  self.init = ->
    $(window).bind 'hashchange', (e) ->
      url = $.param.fragment().substr(1)
      if url is ''
        self.redirectTo(self.rootUrl) if self.rootUrl?
      else
        doNavigation(url)
    $(window).trigger('hashchange')

  self.redirectTo = (url) ->
    if _(self.redirectStack).size() >= self.redirectStackDepthLimit
      PHM.throwException("routing", "redirect stack is too deep!: #{self.redirectStack}")
    else
      self.redirectStack.push(url)
      updateHash("!#{url}")

  self.addRoute = (route, callback) ->
    routeExists = _(self.routes).any (route) ->
      route.name is route
    if routeExists
      PHM.throwException("routing", "route already exists: #{route}")
    preparedRoute =
      name: route
      regexp: routeToRegExp(route)
      callback: callback
    self.routes.push(preparedRoute)

  # private
  doNavigation = (url) ->
    if self.beforeNavigation?
      self.beforeNavigation(url, -> navigateTo(url))
    else
      navigateTo(url)

  navigateTo = (url) ->
    [route, params] = parseURL(url) || [null, null]
    if route?
      route.callback.call(null, params)
      self.redirectStack = []
    else
      PHM.log.info("PHM:routing: Route not found for url: #{url}")
      self.redirectTo(self.rootUrl) if self.rootUrl?

  parseURL = (url) ->
    matched = _(self.routes).find (route) ->
      return route.regexp.test(url)
    if matched?
      params = extractParameters(matched.regexp, url)
      return [matched, params]

  routeToRegExp = (route) ->
    route = route.replace(escapeRegExp, '\\$&')
      .replace(namedParam, '([^\/]+)')
      .replace(splatParam, '(.*?)')
    new RegExp('^' + route + '$')
    
  extractParameters = (routeRegexp, url) ->
    routeRegexp.exec(url).slice(1)

  updateHash = (hash) ->
    location.hash = hash

)()
