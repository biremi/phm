define_test_widget = (template_path) ->
  class TestWidget extends PHM.ui.Widget
    postInit: ->
      @bindClick()
  PHM.app.registerWidgetClass('test_widget', TestWidget, template_path)

clear_app_widgets = ->
  PHM.app.widgetClasses = {}
  PHM.app.widgets = {}

clear_app_widget_events = ->
  PHM.app.eventsList['widget'] = {}

clear_app_control_events = ->
  PHM.app.eventsList['control'] = {}

itShouldHandleSingleHandlerClickEvent = ->
  describe "single click event handling", ->
    it "should not raise exception", ->
      expect( =>
        @eventSource.getElement().click()
      ).not.toThrow()

    it "should set correct caller", ->
      @eventSource.getElement().click()
      expect(@eventCaller).toEqual(@eventSource)

itShouldHandleSingleHandlerCustomEvent = ->
  describe "single custom event handling", ->
    it "should not raise exception", ->
      expect( =>
        @eventSource.fireEvent('my_event', {})
      ).not.toThrow()

    it "should set correct caller", ->
      @eventSource.fireEvent('my_event', {})
      expect(@eventCaller).toEqual(@eventSource)

    it "should set correct data", ->
      fakeData = {id: 1, nickname: "nickname"}
      @eventSource.fireEvent('my_event', fakeData)
      expect(@eventData).toEqual(fakeData)

itShouldHandleMultipleHandlersEvent = ->
  describe "multiple handlers custom event case", ->
    it "should not raise exception", ->
      expect( =>
        @eventSource.fireEvent('my_event', {})
      ).not.toThrow()

    it "should set correct caller for first handler", ->
      @eventSource.fireEvent('my_event', {})
      expect(@firstEventCaller).toEqual(@eventSource)

    it "should set correct caller for second handler", ->
      @eventSource.fireEvent('my_event', {})
      expect(@secondEventCaller).toEqual(@eventSource)

    it "should set correct data for first handler", ->
      fakeData = {id: 1, nickname: "nickname"}
      @eventSource.fireEvent('my_event', fakeData)
      expect(@firstEventData).toEqual(fakeData)

    it "should set correct data for second handler", ->
      fakeData = {id: 2, nickname: "nickname2"}
      @eventSource.fireEvent('my_event', fakeData)
      expect(@secondEventData).toEqual(fakeData)

describe "PHM.eventDispatcher", ->
  beforeEach ->
    setFixtures(sandbox())

  describe "widget events subscription and handling", ->
    beforeEach ->
      define_test_widget("test_widget")
      @widget = PHM.app.addSingletonWidget('test_widget', $('#sandbox'))
      @eventSource = @widget

    afterEach ->
      clear_app_widgets()

    describe "single event handler", ->
      beforeEach ->
        @callback = ->

      afterEach ->
        clear_app_widget_events()

      it "should not raise exception", ->
        expect( ->
          PHM.events.onWidget 'test_widget', 'click', @callback
        ).not.toThrow()

      it "should create handlers array for event", ->
        PHM.events.onWidget 'test_widget', 'click', @callback
        expect(PHM.app.eventsList['widget']['test_widget-click']).toBeDefined()

      it "should add handler to handlers list", ->
        PHM.events.onWidget 'test_widget', 'click', @callback
        expect(PHM.app.eventsList['widget']['test_widget-click']).toContain(@callback)

    describe "event handling: (standart event: click)", ->
      beforeEach ->
        _this = this
        @callback = (data) ->
          _this.eventCaller = this
        PHM.events.onWidget 'test_widget', 'click', @callback

      afterEach ->
        clear_app_widget_events()

      itShouldHandleSingleHandlerClickEvent()

    describe "event handling: (custom event: my_event)", ->
      beforeEach ->
        _this = this
        @callback = (data) ->
          _this.eventCaller = this
          _this.eventData = data
        PHM.events.onWidget 'test_widget', 'my_event', @callback

      afterEach ->
        clear_app_widget_events()

      itShouldHandleSingleHandlerCustomEvent()

    describe "multiple event handlers", ->
      beforeEach ->
        _this = this
        @firstCallback = (data) ->
          _this.firstEventCaller = this
          _this.firstEventData = data
        @secondCallback = (data) ->
          _this.secondEventCaller = this
          _this.secondEventData = data
        PHM.events.onWidget 'test_widget', 'my_event', @firstCallback
        PHM.events.onWidget 'test_widget', 'my_event', @secondCallback

      afterEach ->
        clear_app_widget_events()

      itShouldHandleMultipleHandlersEvent()

  describe "control events subscription and handling", ->
    beforeEach ->
      define_test_widget("test_widget_library")
      @widget = PHM.app.addWidget('test_widget', 100, $('#sandbox'))
      @eventSource = @widget.button

    afterEach ->
      clear_app_widgets()

    describe "single event handler", ->
      beforeEach ->
        @callback = ->

      afterEach ->
        clear_app_control_events()

      it "should not raise exception", ->
        expect( ->
          PHM.events.onControl 'test_widget', 'button', 'click', @callback
        ).not.toThrow()

      it "should create handlers array for event", ->
        PHM.events.onControl 'test_widget', 'button', 'click', @callback
        expect(PHM.app.eventsList['control']['test_widget-button-click']).toBeDefined()

      it "should add handler to handlers list", ->
        PHM.events.onControl 'test_widget', 'button', 'click', @callback
        expect(PHM.app.eventsList['control']['test_widget-button-click']).toContain(@callback)

    describe "event handling: (standart event: click)", ->
      beforeEach ->
        _this = this
        @callback = (data) ->
          _this.eventCaller = this
        PHM.events.onControl 'test_widget', 'button', 'click', @callback

      afterEach ->
        clear_app_control_events()

      itShouldHandleSingleHandlerClickEvent()

    describe "event handling: (custom event: my_event)", ->
      beforeEach ->
        _this = this
        @callback = (data) ->
          _this.eventCaller = this
          _this.eventData = data
        PHM.events.onControl 'test_widget', 'button', 'my_event', @callback

      afterEach ->
        clear_app_control_events()

      itShouldHandleSingleHandlerCustomEvent()

    describe "multiple event handlers", ->
      beforeEach ->
        _this = this
        @firstCallback = (data) ->
          _this.firstEventCaller = this
          _this.firstEventData = data
        @secondCallback = (data) ->
          _this.secondEventCaller = this
          _this.secondEventData = data
        PHM.events.onControl 'test_widget', 'button', 'my_event', @firstCallback
        PHM.events.onControl 'test_widget', 'button', 'my_event', @secondCallback

      afterEach ->
        clear_app_widget_events()

      itShouldHandleMultipleHandlersEvent()
