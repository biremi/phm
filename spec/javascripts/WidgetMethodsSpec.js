(function() {
  var clear_app_widgets, define_test_widget, set_context_validation;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define_test_widget = function(template_path) {
    var TestWidget;
    TestWidget = (function() {

      __extends(TestWidget, PHM.ui.Widget);

      function TestWidget() {
        TestWidget.__super__.constructor.apply(this, arguments);
      }

      return TestWidget;

    })();
    return PHM.app.registerWidgetClass('test_widget', TestWidget, "spec/" + template_path);
  };

  clear_app_widgets = function() {
    PHM.app.widgetClasses = {};
    return PHM.app.widgets = {};
  };

  set_context_validation = function() {
    var widgetClass;
    widgetClass = PHM.app.widgetClasses["test_widget"];
    return widgetClass.validateContext = function(contextId) {
      if (contextId === 13) throw "validation failed";
    };
  };

  describe("PHM.app widget methods", function() {
    beforeEach(function() {
      return setFixtures(sandbox());
    });
    describe("add widget", function() {
      beforeEach(function() {
        return define_test_widget("test_widget");
      });
      afterEach(function() {
        return clear_app_widgets();
      });
      describe("positive case", function() {
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.addWidget("test_widget", 1, $("#sandbox"));
          }).not.toThrow();
        });
        it("should add widget to application", function() {
          PHM.app.addWidget("test_widget", 1, $("#sandbox"));
          return expect(PHM.app.widgets["test_widget"][1]).toBeDefined();
        });
        return it("should add widget to DOM", function() {
          PHM.app.addWidget("test_widget", 5, $("#sandbox"));
          return expect($("#sandbox #test_widget-5")).toExist();
        });
      });
      describe("context validation", function() {
        beforeEach(function() {
          return set_context_validation();
        });
        it("should raise exception about widget context validation", function() {
          return expect(function() {
            return PHM.app.addWidget("test_widget", 13, $("#sandbox"));
          }).toThrow("validation failed");
        });
        it("should not add widget to app", function() {
          try {
            return PHM.app.addWidget("test_widget", 13, $("#sandbox"));
          } catch (exception) {
            if (exception === "validation failed") {
              return expect(PHM.app.widgets["test_widget"]).not.toBeDefined();
            }
          }
        });
        return it("should not add widget to DOM", function() {
          try {
            return PHM.app.addWidget("test_widget", 13, $("#sandbox"));
          } catch (exception) {
            if (exception === "validation failed") {
              return expect($("#sandbox #test_widget-13")).not.toExist();
            }
          }
        });
      });
      describe("negative cases", function() {
        it("should raise exception about unregistered widget class", function() {
          return expect(function() {
            return PHM.app.addWidget("widget", void 0, $("#sandbox"));
          }).toThrow("PHM Exception (widgetClass): widget not found in application");
        });
        it("should raise exception about empty contextId", function() {
          var exception;
          exception = "PHM Exception (widget): can't add widget test_widget without contextId";
          return expect(function() {
            return PHM.app.addWidget("test_widget", void 0, $("#sandbox"));
          }).toThrow(exception);
        });
        return it("should raise exception about same contextId", function() {
          PHM.app.addWidget("test_widget", 4, $("#sandbox"));
          return expect(function() {
            return PHM.app.addWidget("test_widget", 4, $("#sandbox"));
          }).toThrow("PHM Exception (widget): test_widget, id: 4 already registered in app");
        });
      });
      describe("library elements creation", function() {
        beforeEach(function() {
          define_test_widget("test_widget_library");
          return this.widget = PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
        });
        it("should add button to widget", function() {
          return expect(this.widget.button).toBeDefined();
        });
        it("library element should have correct class", function() {
          return expect(this.widget.button.type).toEqual("button");
        });
        it("should add button to DOM", function() {
          return expect($('#sandbox #test_widget-singleton [id|="button"]')).toExist();
        });
        return it("should add correct classes to button div", function() {
          return expect($('#sandbox #test_widget-singleton [id|="button"]')).toHaveClass('test-class');
        });
      });
      return describe("adding child widgets", function() {
        beforeEach(function() {
          var widget;
          widget = PHM.app.addWidget("test_widget", 50, $("#sandbox"));
          return widget.addWidget("test_widget", 100, "child-widget");
        });
        it("should add child widget to application", function() {
          return expect(PHM.app.widgets["test_widget"][100]).toBeDefined();
        });
        return it("should add child widget to DOM", function() {
          return expect($("#sandbox #test_widget-100")).toExist();
        });
      });
    });
    describe("add singleton widget", function() {
      beforeEach(function() {
        return define_test_widget("test_widget");
      });
      afterEach(function() {
        return clear_app_widgets();
      });
      describe("positive case", function() {
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
          }).not.toThrow();
        });
        it("should add widget to application", function() {
          var widget;
          widget = PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
          return expect(PHM.app.widgets["test_widget"]).toEqual(widget);
        });
        return it("should add widget to DOM", function() {
          PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
          return expect($("#sandbox #test_widget-singleton")).toExist();
        });
      });
      return describe("negative case", function() {
        it("should raise exception about unregistered widget class", function() {
          return expect(function() {
            return PHM.app.addSingletonWidget("widget", $("#sandbox"));
          }).toThrow("PHM Exception (widgetClass): widget not found in application");
        });
        return it("should raise exception about widget already registered", function() {
          PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
          return expect(function() {
            return PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
          }).toThrow("PHM Exception (widget): singleton test_widget already registered in app");
        });
      });
    });
    describe("remove widget", function() {
      beforeEach(function() {
        define_test_widget("test_widget");
        return this.widget = PHM.app.addWidget("test_widget", 2, $("#sandbox"));
      });
      afterEach(function() {
        return clear_app_widgets();
      });
      it("should have correct setup", function() {
        expect(PHM.app.widgets["test_widget"][2]).toBeDefined();
        return expect($("#sandbox #test_widget-2")).toExist();
      });
      describe("positive simple case", function() {
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.removeWidget("test_widget", 2);
          }).not.toThrow();
        });
        it("should remove widget from application", function() {
          PHM.app.removeWidget("test_widget", 2);
          return expect(PHM.app.widgets["test_widget"][2]).not.toBeDefined();
        });
        return it("should remove widget from DOM", function() {
          PHM.app.removeWidget("test_widget", 2);
          return expect($("#sandbox #test_widget-2")).not.toExist();
        });
      });
      describe("removing not existing widget", function() {
        return it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.removeWidget("test_widget", 4);
          }).not.toThrow();
        });
      });
      return describe("removing child widgets", function() {
        beforeEach(function() {
          return this.widget.addWidget("test_widget", 100, "child-widget");
        });
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.removeWidget("test_widget", 2);
          }).not.toThrow();
        });
        it("should remove child widget from application", function() {
          PHM.app.removeWidget("test_widget", 100);
          return expect(PHM.app.widgets["test_widget"][100]).not.toBeDefined();
        });
        return it("should remove child widget from DOM", function() {
          PHM.app.removeWidget("test_widget", 100);
          return expect($("#sandbox #test_widget-100")).not.toExist();
        });
      });
    });
    return describe("remove singleton widget", function() {
      beforeEach(function() {
        define_test_widget("test_widget");
        return this.widget = PHM.app.addSingletonWidget("test_widget", $("#sandbox"));
      });
      afterEach(function() {
        return clear_app_widgets();
      });
      it("should have correct setup", function() {
        expect(PHM.app.widgets["test_widget"]).toEqual(this.widget);
        return expect($("#sandbox #test_widget-singleton")).toExist();
      });
      describe("positive simple case", function() {
        it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.removeSingletonWidget("test_widget");
          }).not.toThrow();
        });
        it("should remove widget from application", function() {
          PHM.app.removeSingletonWidget("test_widget");
          return expect(PHM.app.widgets["test_widget"]).not.toBeDefined();
        });
        return it("should remove widget from DOM", function() {
          PHM.app.removeSingletonWidget("test_widget");
          return expect($("#sandbox #test_widget-singleton")).not.toExist();
        });
      });
      return describe("removing not existing widget", function() {
        return it("should not raise exception", function() {
          return expect(function() {
            return PHM.app.removeSingletonWidget("test_widgetssss");
          }).not.toThrow();
        });
      });
    });
  });

}).call(this);
