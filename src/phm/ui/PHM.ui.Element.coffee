###
PHM.ui.Element module
###
(->
  exports = this
  exports.PHM.ui.Element =
    addClass: (name) ->
      $("##{@elementId}").addClass(name)
    removeClass: (name) ->
      $("##{@elementId}").removeClass(name)  
    hasClass: (name) ->
      $("##{@elementId}").hasClass(name)
    addChildElementClass: (selector, name) ->
      element = @getChildElement(selector)
      element.addClass(name)
    removeChildElementClass: (selector, name) ->
      element = @getChildElement(selector)
      element.removeClass(name)
    show: ->
      @removeClass('state-hidden')
    hide: ->
      @addClass('state-hidden')
    isHidden: ->
      @hasClass('state-hidden')
    isVisible: ->
      !@isHidden()
    startLoading: ->
      @addClass('loading')
      @disableClick()
    stopLoading: ->
      @removeClass('loading')
      @enableClick()
    disable: ->
      @addClass('disabled')
      @disableClick()
    enable: ->
      @removeClass('disabled')
      @enableClick()
    disableClick: ->
      @disabled = true
    enableClick: ->
      @disabled = false
    isDisabled: ->
      @disabled? && @disabled is true
    activate: ->
      @addClass('active')
    deactivate: ->
      @removeClass('active')
    isActive: ->
      @hasClass('active')
    setIdle: ->
      @addClass('idle')
    removeIdle: ->
      @removeClass('idle')
    getChildElement: (selector)->
      $("##{@elementId} [data-jsclass=#{selector}]")
    showChildElement: (selector)->
      @removeChildElementClass(selector, 'state-hidden')
    hideChildElement: (selector)->
      @addChildElementClass(selector, 'state-hidden')
    toggleChildElement: (selector) ->
      element = @getChildElement(selector)
      element.toggleClass('state-hidden')
    setChildElementText: (selector, text) ->
      element = @getChildElement(selector)
      element.text(text)
    getChildElementText: (selector) ->
      element = @getChildElement(selector)
      element.text()
    setChildElementValue: (selector, value) ->
      element = @getChildElement(selector)
      element.val(value)
    getChildElementValue: (selector) ->
      element = @getChildElement(selector)
      element?.val()
    emptyChildElement: (selector) ->
      element = @getChildElement(selector)
      element.empty()
)()
