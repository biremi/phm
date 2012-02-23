###
JAF.ui.CommonWidget module
###
(->
  exports = this
  exports.JAF.ui.CommonWidget =
    renderView: () ->
      params = if @prepareRenderParams?
        @prepareRenderParams()
      else 
        {}
      params.elementId = @elementId
      if @contextId? then params.contextId = @contextId
      JAF.ui.renderView(@template || @viewPath, params)

    getElement: ->
      $("##{@elementId}")

    # Events methods
    bindClick: (callback=null) ->
      element = @getElement()
      _this = this
      element.click (event) ->
        if !_this.isDisabled()
          callback.call(_this) if callback?
          _this.fireEvent("click")
        if _this.hasFocus? and _this.hasFocus is true
          event.stopPropagation()
      @clickBinded = true

    setFocus: ->
      setTimeout( =>
        @hasFocus = true
        JAF.app.focusWidget = this
        @addClass('focus')
        @bindClick() unless @clickBinded?
      , 0)

    fireBlur: ->
      @hasFocus = false
      @removeClass('focus')
      @fireEvent("blur")

    getSelector: (jsClass) ->
      JAF.ui.getSelector(jsClass, @elementId)

    remove: ->
      @getElement().remove()
)()
