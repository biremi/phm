###
PHM.ui module
###
exports = this
self = exports.PHM.ui =
  Library: {}
  SEARCH_ATTRIBUTE: "data-jsclass"

self.enterKeyCode = 13
self.escapeKeyCode = 27

# Common methods
self.getSelector = (jsClass, wrapperId = null) ->
  selector = "[#{self.SEARCH_ATTRIBUTE}=#{jsClass}]"
  selector = "##{wrapperId} #{selector}" if wrapperId?
  $(selector)

self.renderView = (viewPath, params) ->
  if JST[viewPath]?
    JST[viewPath](params)
  else
    PHM.throwException("ui", "missing template: #{viewPath}")

# Widgets methods
self.appendView = (viewPath, placeholder, params) ->
  view = self.renderView(viewPath, params)
  placeholder.append(view)

# Library methods
self.registerLibraryElement = (type, elementClass, viewPath = null) ->
  self.Library[type] = elementClass
  elementClass::type = type
  elementClass::viewPath = viewPath || "library/#{type}"

self.addLibraryElement = (type, placeholder) ->
  element = createLibraryElement(type, placeholder)
  element.replace(placeholder)
  element

# Private helpers
createLibraryElement = (type, placeholder) ->
  elementClass = getLibraryElementClass(type)
  element = new elementClass(placeholder)
  element

getLibraryElementClass = (type) ->
  elementClass = PHM.ui.Library[type]
  PHM.throwException("ui", "invalid UI element type: #{type}") if !elementClass?
  elementClass
