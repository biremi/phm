###
PHM.ui.CommonWidget module
###
exports = this
exports.PHM.ui.CommonWidget =
  renderView: () ->
    params = if @prepareRenderParams?
      @prepareRenderParams()
    else 
      {}
    if @contextId? then params.contextId = @contextId
    html = PHM.ui.renderView(@template || @viewPath, params)
    $("<p>").append($(html).attr('id', @elementId)).html()

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
      PHM.app.focusWidget = this
      @addClass('focus')
      @bindClick() unless @clickBinded?
    , 0)

  fireBlur: ->
    @hasFocus = false
    @removeClass('focus')
    @fireEvent("blur")

  getSelector: (jsClass) ->
    PHM.ui.getSelector(jsClass, @elementId)

  remove: ->
    @getElement().remove()
