(function() {
  var clear_app_control_events, clear_app_widget_events, clear_app_widgets, define_test_widget, itShouldHandleMultipleHandlersEvent, itShouldHandleSingleHandlerClickEvent, itShouldHandleSingleHandlerCustomEvent;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define_test_widget = function(template_path) {
    var TestWidget;
    TestWidget = (function() {

      __extends(TestWidget, PHM.ui.Widget);

      function TestWidget() {
        TestWidget.__super__.constructor.apply(this, arguments);
      }

      TestWidget.prototype.postInit = function() {
        return this.bindClick();
      };

      return TestWidget;

    })();
    return PHM.app.registerWidgetClass('test_widget', TestWidget, "spec/" + template_path);
  };

  clear_app_widgets = function() {
    PHM.app.widgetClasses = {};
    return PHM.app.widgets = {};
  };

  clear_app_widget_events = function() {
    return PHM.app.eventsList['widget'] = {};
  };

  clear_app_control_events = function() {
    return PHM.app.eventsList['control'] = {};
  };

  itShouldHandleSingleHandlerClickEvent = function() {
    return describe("single click event handling", function() {
      it("should not raise exception", function() {
        var _this = this;
        return expect(function() {
          return _this.eventSource.getElement().click();
        }).not.toThrow();
      });
      return it("should set correct caller", function() {
        this.eventSource.getElement().click();
        return expect(this.eventCaller).toEqual(this.eventSource);
      });
    });
  };

  itShouldHandleSingleHandlerCustomEvent = function() {
    return describe("single custom event handling", function() {
      it("should not raise exception", function() {
        var _this = this;
        return expect(function() {
          return _this.eventSource.fireEvent('my_event', {});
        }).not.toThrow();
      });
      it("should set correct caller", function() {
        this.eventSource.fireEvent('my_event', {});
        return expect(this.eventCaller).toEqual(this.eventSource);
      });
      return it("should set correct data", function() {
        var fakeData;
        fakeData = {
          id: 1,
          login: "login"
        };
        this.eventSource.fireEvent('my_event', fakeData);
        return expect(this.eventData).toEqual(fakeData);
      });
    });
  };

  itShouldHandleMultipleHandlersEvent = function() {
    return describe("multiple handlers custom event case", function() {
      it("should not raise exception", function() {
        var _this = this;
        return expect(function() {
          return _this.eventSource.fireEvent('my_event', {});
        }).not.toThrow();
      });
      it("should set correct caller for first handler", function() {
        this.eventSource.fireEvent('my_event', {});
        return expect(this.firstEventCaller).toEqual(this.eventSource);
      });
      it("should set correct caller for second handler", function() {
        this.eventSource.fireEvent('my_event', {});
        return expect(this.secondEventCaller).toEqual(this.eventSource);
      });
      it("should set correct data for first handler", function() {
        var fakeData;
        fakeData = {
          id: 1,
          login: "login"
        };
        this.eventSource.fireEvent('my_event', fakeData);
        return expect(this.firstEventData).toEqual(fakeData);
      });
      return it("should set correct data for second handler", function() {
        var fakeData;
        fakeData = {
          id: 2,
          login: "login2"
        };
        this.eventSource.fireEvent('my_event', fakeData);
        return expect(this.secondEventData).toEqual(fakeData);
      });
    });
  };

  describe("PHM.eventDispatcher", function() {
    beforeEach(function() {
      return setFixtures(sandbox());
    });
    describe("widget events subscription and handling", function() {
      beforeEach(function() {
        define_test_widget("test_widget");
        this.widget = PHM.app.addSingletonWidget('test_widget', $('#sandbox'));
        return this.eventSource = this.widget;
      });
      afterEach(function() {
        return clear_app_widgets();
      });
      describe("single event handler", function() {
        beforeEach(function() {
          return this.callback = function() {};
        });
        afterEach(function() {
          return clear_app_widget_events();
        });
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.events.onWidget('test_widget', 'click', this.callback);
          }).not.toThrow();
        });
        it("should create handlers array for event", function() {
          PHM.events.onWidget('test_widget', 'click', this.callback);
          return expect(PHM.app.eventsList['widget']['test_widget-click']).toBeDefined();
        });
        return it("should add handler to handlers list", function() {
          PHM.events.onWidget('test_widget', 'click', this.callback);
          return expect(PHM.app.eventsList['widget']['test_widget-click']).toContain(this.callback);
        });
      });
      describe("event handling: (standart event: click)", function() {
        beforeEach(function() {
          var _this;
          _this = this;
          this.callback = function(data) {
            return _this.eventCaller = this;
          };
          return PHM.events.onWidget('test_widget', 'click', this.callback);
        });
        afterEach(function() {
          return clear_app_widget_events();
        });
        return itShouldHandleSingleHandlerClickEvent();
      });
      describe("event handling: (custom event: my_event)", function() {
        beforeEach(function() {
          var _this;
          _this = this;
          this.callback = function(data) {
            _this.eventCaller = this;
            return _this.eventData = data;
          };
          return PHM.events.onWidget('test_widget', 'my_event', this.callback);
        });
        afterEach(function() {
          return clear_app_widget_events();
        });
        return itShouldHandleSingleHandlerCustomEvent();
      });
      return describe("multiple event handlers", function() {
        beforeEach(function() {
          var _this;
          _this = this;
          this.firstCallback = function(data) {
            _this.firstEventCaller = this;
            return _this.firstEventData = data;
          };
          this.secondCallback = function(data) {
            _this.secondEventCaller = this;
            return _this.secondEventData = data;
          };
          PHM.events.onWidget('test_widget', 'my_event', this.firstCallback);
          return PHM.events.onWidget('test_widget', 'my_event', this.secondCallback);
        });
        afterEach(function() {
          return clear_app_widget_events();
        });
        return itShouldHandleMultipleHandlersEvent();
      });
    });
    return describe("control events subscription and handling", function() {
      beforeEach(function() {
        define_test_widget("test_widget_library");
        this.widget = PHM.app.addWidget('test_widget', 100, $('#sandbox'));
        return this.eventSource = this.widget.button;
      });
      afterEach(function() {
        return clear_app_widgets();
      });
      describe("single event handler", function() {
        beforeEach(function() {
          return this.callback = function() {};
        });
        afterEach(function() {
          return clear_app_control_events();
        });
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.events.onControl('test_widget', 'button', 'click', this.callback);
          }).not.toThrow();
        });
        it("should create handlers array for event", function() {
          PHM.events.onControl('test_widget', 'button', 'click', this.callback);
          return expect(PHM.app.eventsList['control']['test_widget-button-click']).toBeDefined();
        });
        return it("should add handler to handlers list", function() {
          PHM.events.onControl('test_widget', 'button', 'click', this.callback);
          return expect(PHM.app.eventsList['control']['test_widget-button-click']).toContain(this.callback);
        });
      });
      describe("event handling: (standart event: click)", function() {
        beforeEach(function() {
          var _this;
          _this = this;
          this.callback = function(data) {
            return _this.eventCaller = this;
          };
          return PHM.events.onControl('test_widget', 'button', 'click', this.callback);
        });
        afterEach(function() {
          return clear_app_control_events();
        });
        return itShouldHandleSingleHandlerClickEvent();
      });
      describe("event handling: (custom event: my_event)", function() {
        beforeEach(function() {
          var _this;
          _this = this;
          this.callback = function(data) {
            _this.eventCaller = this;
            return _this.eventData = data;
          };
          return PHM.events.onControl('test_widget', 'button', 'my_event', this.callback);
        });
        afterEach(function() {
          return clear_app_control_events();
        });
        return itShouldHandleSingleHandlerCustomEvent();
      });
      return describe("multiple event handlers", function() {
        beforeEach(function() {
          var _this;
          _this = this;
          this.firstCallback = function(data) {
            _this.firstEventCaller = this;
            return _this.firstEventData = data;
          };
          this.secondCallback = function(data) {
            _this.secondEventCaller = this;
            return _this.secondEventData = data;
          };
          PHM.events.onControl('test_widget', 'button', 'my_event', this.firstCallback);
          return PHM.events.onControl('test_widget', 'button', 'my_event', this.secondCallback);
        });
        afterEach(function() {
          return clear_app_widget_events();
        });
        return itShouldHandleMultipleHandlersEvent();
      });
    });
  });

}).call(this);
