define_test_widget = (template_path) ->
  class TestWidget extends PHM.ui.Widget
  PHM.app.registerWidgetClass('test_widget', TestWidget, template_path)

clear_app_widgets = ->
  PHM.app.widgetClasses = {}
  PHM.app.widgets = {}

set_context_validation = ->
  widgetClass = PHM.app.widgetClasses["test_widget"]
  widgetClass.validateContext = (contextId)->
    throw "validation failed" if contextId is 13

describe "PHM.app widget methods", ->
  beforeEach ->
    setFixtures(sandbox())

  describe "add widget", ->
    beforeEach ->
      define_test_widget("test_widget")
    afterEach ->
      clear_app_widgets()

    describe "positive case", ->
      it "should not raise exception", ->
        expect( ->
          PHM.app.addWidget("test_widget", 1, $("#sandbox"))
        ).not.toThrow()

      it "should add widget to application", ->
        PHM.app.addWidget("test_widget", 1, $("#sandbox"))
        expect(PHM.app.widgets["test_widget"][1]).toBeDefined()

      it "should add widget to DOM", ->
        PHM.app.addWidget("test_widget", 5, $("#sandbox"))
        expect($("#sandbox #test_widget-5")).toExist()

    describe "context validation", ->
      beforeEach ->
        set_context_validation()

      it "should raise exception about widget context validation", ->
        expect( ->
          PHM.app.addWidget("test_widget", 13, $("#sandbox"))
        ).toThrow("validation failed")

      it "should not add widget to app", ->
        try
          PHM.app.addWidget("test_widget", 13, $("#sandbox"))
        catch exception
          if exception is "validation failed"
            expect(PHM.app.widgets["test_widget"]).not.toBeDefined()

      it "should not add widget to DOM", ->
        try
          PHM.app.addWidget("test_widget", 13, $("#sandbox"))
        catch exception
          if exception is "validation failed"
            expect($("#sandbox #test_widget-13")).not.toExist()

    describe "negative cases", ->
      it "should raise exception about unregistered widget class", ->
        expect( ->
          PHM.app.addWidget("widget", undefined, $("#sandbox"))
        ).toThrow("PHM Exception (widgetClass): widget not found in application")

      it "should raise exception about empty contextId", ->
        exception = "PHM Exception (widget): can't add widget test_widget without contextId"
        expect( ->
          PHM.app.addWidget("test_widget", undefined, $("#sandbox"))
        ).toThrow(exception)

      it "should raise exception about same contextId", ->
        PHM.app.addWidget("test_widget", 4, $("#sandbox"))
        expect( ->
          PHM.app.addWidget("test_widget", 4, $("#sandbox"))
        ).toThrow("PHM Exception (widget): test_widget, id: 4 already registered in app")
    describe "library elements creation", ->
      beforeEach ->
        define_test_widget("test_widget_library")
        @widget = PHM.app.addSingletonWidget("test_widget", $("#sandbox"))

      it "should add button to widget", ->
        expect(@widget.button).toBeDefined()

      it "library element should have correct class", ->
        expect(@widget.button.type).toEqual("button")

      it "should add button to DOM", ->
        expect($('#sandbox #test_widget-singleton [id|="button"]')).toExist()

      it "should add correct classes to button div", ->
        expect($('#sandbox #test_widget-singleton [id|="button"]')).toHaveClass('test-class')

    describe "adding child widgets", ->
      beforeEach ->
        widget = PHM.app.addWidget("test_widget", 50, $("#sandbox"))
        widget.addWidget("test_widget", 100, "child-widget")

      it "should add child widget to application", ->
        expect(PHM.app.widgets["test_widget"][100]).toBeDefined()

      it "should add child widget to DOM", ->
        expect($("#sandbox #test_widget-100")).toExist()

  describe "add singleton widget", ->
    beforeEach ->
      define_test_widget("test_widget")
    afterEach ->
      clear_app_widgets()

    describe "positive case", ->
      it "should not raise exception", ->
        expect( ->
          PHM.app.addSingletonWidget("test_widget", $("#sandbox"))
        ).not.toThrow()

      it "should add widget to application", ->
        widget = PHM.app.addSingletonWidget("test_widget", $("#sandbox"))
        expect(PHM.app.widgets["test_widget"]).toEqual(widget)

      it "should add widget to DOM", ->
        PHM.app.addSingletonWidget("test_widget", $("#sandbox"))
        expect($("#sandbox #test_widget-singleton")).toExist()

    describe "negative case", ->
      it "should raise exception about unregistered widget class", ->
        expect( ->
          PHM.app.addSingletonWidget("widget", $("#sandbox"))
        ).toThrow("PHM Exception (widgetClass): widget not found in application")

      it "should raise exception about widget already registered", ->
        PHM.app.addSingletonWidget("test_widget", $("#sandbox"))
        expect( ->
          PHM.app.addSingletonWidget("test_widget", $("#sandbox"))
        ).toThrow("PHM Exception (widget): singleton test_widget already registered in app")

  describe "remove widget", ->
    beforeEach ->
      define_test_widget("test_widget")
      @widget = PHM.app.addWidget("test_widget", 2, $("#sandbox"))
    afterEach ->
      clear_app_widgets()

    it "should have correct setup", ->
      expect(PHM.app.widgets["test_widget"][2]).toBeDefined()
      expect($("#sandbox #test_widget-2")).toExist()

    describe "positive simple case", ->
      it "should not raise exception", ->
        expect( ->
          PHM.app.removeWidget("test_widget", 2)
        ).not.toThrow()

      it "should remove widget from application", ->
        PHM.app.removeWidget("test_widget", 2)
        expect(PHM.app.widgets["test_widget"][2]).not.toBeDefined()

      it "should remove widget from DOM", ->
        PHM.app.removeWidget("test_widget", 2)
        expect($("#sandbox #test_widget-2")).not.toExist()

    describe "removing not existing widget", ->
      it "should not raise exception", ->
        expect( ->
          PHM.app.removeWidget("test_widget", 4)
        ).not.toThrow()

    describe "removing child widgets", ->
      beforeEach ->
        @widget.addWidget("test_widget", 100, "child-widget")

      it "should not raise exception", ->
        expect( ->
          PHM.app.removeWidget("test_widget", 2)
        ).not.toThrow()

      it "should remove child widget from application", ->
        PHM.app.removeWidget("test_widget", 100)
        expect(PHM.app.widgets["test_widget"][100]).not.toBeDefined()

      it "should remove child widget from DOM", ->
        PHM.app.removeWidget("test_widget", 100)
        expect($("#sandbox #test_widget-100")).not.toExist()

  describe "remove singleton widget", ->
    beforeEach ->
      define_test_widget("test_widget")
      @widget = PHM.app.addSingletonWidget("test_widget", $("#sandbox"))
    afterEach ->
      clear_app_widgets()

    it "should have correct setup", ->
      expect(PHM.app.widgets["test_widget"]).toEqual(@widget)
      expect($("#sandbox #test_widget-singleton")).toExist()

    describe "positive simple case", ->
      it "should not raise exception", ->
        expect( ->
          PHM.app.removeSingletonWidget("test_widget")
        ).not.toThrow()

      it "should remove widget from application", ->
        PHM.app.removeSingletonWidget("test_widget")
        expect(PHM.app.widgets["test_widget"]).not.toBeDefined()

      it "should remove widget from DOM", ->
        PHM.app.removeSingletonWidget("test_widget")
        expect($("#sandbox #test_widget-singleton")).not.toExist()

    describe "removing not existing widget", ->
      it "should not raise exception", ->
        expect( ->
          PHM.app.removeSingletonWidget("test_widgetssss")
        ).not.toThrow()

