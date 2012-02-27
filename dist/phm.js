(function() {
  var exports, self;

  exports = this;

  if (!exports.PHM) {
    self = exports.PHM = {
      VERSION: '0.1'
    };
  }

  self.initBlurHandler = function() {
    return $(document).click(function() {
      return self.processBlur();
    });
  };

  self.throwException = function(type, text) {
    throw new Error("PHM Exception (" + type + "): " + text);
  };

  self.processBlur = function() {
    var focusWidget;
    focusWidget = PHM.app.focusWidget;
    if (focusWidget != null) {
      focusWidget.fireBlur();
      return PHM.app.focusWidget = null;
    }
  };

}).call(this);

/*
PHM.log module
*/

(function() {
  var addTrailingZero, exports, getHours, getMilliseconds, getMinutes, getSeconds, getTimestamp, logToConsole, self;

  exports = this;

  self = exports.PHM.log = {};

  self.info = function(message) {
    return logToConsole('info', message);
  };

  self.error = function(message) {
    return logToConsole('error', message);
  };

  logToConsole = function(logLevel, message) {
    var log, ts;
    ts = getTimestamp();
    log = function(obj) {
      return console[logLevel](obj);
    };
    if (typeof message === 'string') {
      return log("[" + ts + "] " + message);
    } else {
      log("[" + ts + "]");
      return log(message);
    }
  };

  getTimestamp = function() {
    var hours, milliseconds, minutes, seconds, time;
    time = new Date();
    hours = getHours(time);
    minutes = getMinutes(time);
    seconds = getSeconds(time);
    milliseconds = getMilliseconds(time);
    return "" + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  };

  getHours = function(time) {
    return addTrailingZero(time.getHours());
  };

  getMinutes = function(time) {
    return addTrailingZero(time.getMinutes());
  };

  getSeconds = function(time) {
    return addTrailingZero(time.getSeconds());
  };

  getMilliseconds = function(time) {
    var ms;
    ms = time.getMilliseconds();
    if (ms < 10) {
      return "00" + ms;
    } else if (ms < 100) {
      return "0" + ms;
    } else {
      return "" + ms;
    }
  };

  addTrailingZero = function(number) {
    if (number < 10) {
      return "0" + number;
    } else {
      return "" + number;
    }
  };

}).call(this);

/*
PHM.utils module
*/

(function() {
  var exports, self;

  exports = this;

  self = exports.PHM.utils = {};

  self.uniqIdShift = 0;

  self.extend = function(obj, mixin) {
    var method, name;
    for (name in mixin) {
      method = mixin[name];
      obj[name] = method;
    }
    return obj;
  };

  self.include = function(klass, mixin) {
    return self.extend(klass.prototype, mixin);
  };

  self.generateUniqId = function() {
    var time;
    time = new Date();
    return time.getTime() + "_" + self.uniqIdShift++;
  };

}).call(this);

/*
PHM.app module
*/

(function() {
  var checkRegisteredSingletonWidget, checkRegisteredWidget, checkWidgetClass, createWidget, exports, registerSingletonWidget, registerWidget, self, unregisterSingletonWidget, unregisterWidget, validateWidgetContext;

  exports = this;

  self = exports.PHM.app = {
    widgetClasses: {},
    widgets: {},
    models: {},
    db: {},
    behaviors: {},
    eventsList: {
      "comet": {},
      "area": {},
      "widget": {},
      "control": {}
    },
    focusWidget: null
  };

  self.hasWidget = function(className, contextId) {
    var collection;
    collection = self.widgets[className];
    return (collection != null) && (collection[contextId] != null);
  };

  self.registerWidgetClass = function(className, widgetClass, viewPath) {
    if (viewPath == null) viewPath = null;
    self.widgetClasses[className] = widgetClass;
    widgetClass.prototype.className = className;
    return widgetClass.prototype.viewPath = viewPath || className;
  };

  self.addWidget = function(className, contextId, placeholder, params) {
    var widget;
    checkWidgetClass(className);
    validateWidgetContext(className, contextId);
    checkRegisteredWidget(className, contextId);
    widget = createWidget(className, contextId, params);
    widget.appendTo(placeholder, params != null ? params.prepend : void 0);
    registerWidget(widget, contextId);
    if (widget.postInit != null) widget.postInit();
    return widget;
  };

  self.addSingletonWidget = function(className, placeholder, params) {
    var widget;
    checkWidgetClass(className);
    checkRegisteredSingletonWidget(className);
    widget = createWidget(className, "singleton", params);
    widget.appendTo(placeholder, params != null ? params.prepend : void 0);
    registerSingletonWidget(widget);
    if (widget.postInit != null) widget.postInit();
    return widget;
  };

  self.removeWidget = function(className, contextId) {
    var widget;
    widget = self.getWidget(className, contextId);
    if (widget != null) {
      widget.removeChildren();
      widget.remove();
      return unregisterWidget(widget);
    }
  };

  self.removeSingletonWidget = function(className) {
    var widget;
    widget = self.getSingletonWidget(className);
    if (widget != null) {
      widget.remove();
      return unregisterSingletonWidget(widget);
    }
  };

  self.getWidget = function(className, contextId) {
    var _ref;
    return (_ref = self.widgets[className]) != null ? _ref[contextId] : void 0;
  };

  self.getSingletonWidget = function(className) {
    return self.widgets[className];
  };

  createWidget = function(className, contextId, params) {
    var widget, widgetClass;
    widgetClass = self.widgetClasses[className];
    return widget = new widgetClass(contextId, params);
  };

  checkWidgetClass = function(className) {
    var widgetClass;
    widgetClass = self.widgetClasses[className];
    if (!(widgetClass != null)) {
      return PHM.throwException("widgetClass", "" + className + " not found in application");
    }
  };

  validateWidgetContext = function(className, contextId) {
    var message, widgetClass;
    if (!(contextId != null)) {
      message = "can't add widget " + className + " without contextId";
      PHM.throwException("widget", message);
    }
    widgetClass = self.widgetClasses[className];
    if (widgetClass.validateContext != null) {
      return widgetClass.validateContext(contextId);
    }
  };

  checkRegisteredWidget = function(className, contextId) {
    var collection, message;
    collection = self.widgets[className];
    if ((collection != null) && (collection[contextId] != null)) {
      message = "" + className + ", id: " + contextId + " already registered in app";
      return PHM.throwException("widget", message);
    }
  };

  checkRegisteredSingletonWidget = function(className) {
    var message;
    if (self.widgets[className] != null) {
      message = "singleton " + className + " already registered in app";
      return PHM.throwException("widget", message);
    }
  };

  registerWidget = function(widget, contextId) {
    if (!(self.widgets[widget.className] != null)) {
      self.widgets[widget.className] = {};
    }
    return self.widgets[widget.className][contextId] = widget;
  };

  registerSingletonWidget = function(widget) {
    return self.widgets[widget.className] = widget;
  };

  unregisterWidget = function(widget) {
    return delete self.widgets[widget.className][widget.contextId];
  };

  unregisterSingletonWidget = function(widget) {
    return delete self.widgets[widget.className];
  };

}).call(this);

/*
PHM.ui module
*/

(function() {
  var createLibraryElement, exports, getLibraryElementClass, self;

  exports = this;

  self = exports.PHM.ui = {
    Library: {},
    SEARCH_ATTRIBUTE: "data-jsclass"
  };

  self.enterKeyCode = 13;

  self.escapeKeyCode = 27;

  self.getSelector = function(jsClass, wrapperId) {
    var selector;
    if (wrapperId == null) wrapperId = null;
    selector = "[" + self.SEARCH_ATTRIBUTE + "=" + jsClass + "]";
    if (wrapperId != null) selector = "#" + wrapperId + " " + selector;
    return $(selector);
  };

  self.renderView = function(viewPath, params) {
    if (JST[viewPath] != null) {
      return JST[viewPath](params);
    } else {
      return PHM.throwException("ui", "missing template: " + viewPath);
    }
  };

  self.appendView = function(viewPath, placeholder, params) {
    var view;
    view = self.renderView(viewPath, params);
    return placeholder.append(view);
  };

  self.registerLibraryElement = function(type, elementClass, viewPath) {
    if (viewPath == null) viewPath = null;
    self.Library[type] = elementClass;
    elementClass.prototype.type = type;
    return elementClass.prototype.viewPath = viewPath || ("library/" + type);
  };

  self.addLibraryElement = function(type, placeholder) {
    var element;
    element = createLibraryElement(type, placeholder);
    element.replace(placeholder);
    return element;
  };

  createLibraryElement = function(type, placeholder) {
    var element, elementClass;
    elementClass = getLibraryElementClass(type);
    element = new elementClass(placeholder);
    return element;
  };

  getLibraryElementClass = function(type) {
    var elementClass;
    elementClass = PHM.ui.Library[type];
    if (!(elementClass != null)) {
      PHM.throwException("ui", "invalid UI element type: " + type);
    }
    return elementClass;
  };

}).call(this);

/*
PHM.eventsDispatcher module
*/

(function() {
  var addAreaEventHandler, addCometEventHandler, addControlEventHandler, addEventHandler, addWidgetEventHandler, controlEventName, eventsList, exports, getEventHandlers, handleAreaEvent, handleEvent, handleSimpleEvent, self, widgetEventName;

  exports = this;

  self = exports.PHM.eventsDispatcher = {};

  exports.PHM.events = self;

  eventsList = PHM.app.eventsList;

  self.fireAreaEvent = function(eventName, data) {
    return handleAreaEvent(eventName, data);
  };

  self.onArea = function(eventName, handler) {
    return addAreaEventHandler(eventName, handler);
  };

  self.onComet = function(eventName, handler) {
    return addCometEventHandler(eventName, handler);
  };

  self.onWidget = function(widgetClass, eventName, handler) {
    return addWidgetEventHandler(widgetClass, eventName, handler);
  };

  self.onControl = function(widgetClass, controlName, eventName, handler) {
    return addControlEventHandler(widgetClass, controlName, eventName, handler);
  };

  addCometEventHandler = function(eventName, handler) {
    return addEventHandler("comet", eventName, handler);
  };

  addAreaEventHandler = function(eventName, handler) {
    return addEventHandler("area", eventName, handler);
  };

  addWidgetEventHandler = function(widgetClass, eventName, handler) {
    var eventFullName;
    eventFullName = widgetEventName(widgetClass, eventName);
    return addEventHandler("widget", eventFullName, handler);
  };

  addControlEventHandler = function(widgetClass, controlName, eventName, handler) {
    var eventFullName;
    eventFullName = "" + widgetClass + "-" + controlName + "-" + eventName;
    return addEventHandler("control", eventFullName, handler);
  };

  addEventHandler = function(eventSource, eventName, handler) {
    var handlers;
    handlers = getEventHandlers(eventSource, eventName);
    if (_(handlers).size() === 0) {
      return eventsList[eventSource][eventName] = [handler];
    } else {
      return handlers.push(handler);
    }
  };

  handleAreaEvent = function(eventName, data) {
    return handleSimpleEvent("area", eventName, data);
  };

  self.handleCometEvent = function(eventName, data) {
    return handleSimpleEvent("comet", eventName, data);
  };

  self.handleWidgetEvent = function(widget, eventName, data) {
    var eventFullName;
    eventFullName = widgetEventName(widget.className, eventName);
    return handleEvent("widget", widget, eventFullName, data);
  };

  self.handleControlEvent = function(control, eventName, data) {
    var eventFullName, widgetClass;
    widgetClass = control.parentWidget.className;
    eventFullName = controlEventName(widgetClass, control.name, eventName);
    return handleEvent("control", control, eventFullName, data);
  };

  getEventHandlers = function(eventSource, eventName) {
    return eventsList[eventSource][eventName] || [];
  };

  widgetEventName = function(widgetClass, eventName) {
    return "" + widgetClass + "-" + eventName;
  };

  controlEventName = function(widgetClass, controlName, eventName) {
    return "" + widgetClass + "-" + controlName + "-" + eventName;
  };

  handleEvent = function(source, caller, name, data) {
    var handler, handlers, message, _i, _len, _results;
    if (data == null) data = null;
    message = "Event: caller: " + caller + ",                    source: " + source + ",                    data: " + data + ",                    name: " + name;
    PHM.log.info(message);
    handlers = getEventHandlers(source, name);
    _results = [];
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      handler = handlers[_i];
      _results.push(handler.call(caller, data));
    }
    return _results;
  };

  handleSimpleEvent = function(source, name, data) {
    var handler, handlers, _i, _len, _results;
    if (data == null) data = null;
    PHM.log.info("Simple event: source: " + source + ", data: " + data + ", name: " + name);
    handlers = getEventHandlers(source, name);
    _results = [];
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      handler = handlers[_i];
      _results.push(handler.call(null, data));
    }
    return _results;
  };

}).call(this);

/*
PHM.comet module
*/

(function() {

  (function() {
    var exports, self;
    exports = this;
    self = exports.PHM.comet = {};
    self.client = null;
    self.on = function(eventName, handler) {
      return PHM.eventsDispatcher.onComet(eventName, handler);
    };
    self.dispatchEvent = function(eventName, data) {
      return PHM.eventsDispatcher.handleCometEvent(eventName, data);
    };
    self.init = function(host, port, channel) {
      self.client = new PHM.comet.Client();
      return self.client.connect(host, port, channel);
    };
    return self.disconnect = function() {
      PHM.log.info("started comet disconnection");
      try {
        PHM.comet.client.disconnect();
        return PHM.log.info("disconnection: closing connection");
      } catch (e) {
        return PHM.log.info("ERROR on disconnect: " + e.name + " : " + e.message);
      }
    };
  })();

  (function() {
    var Client, exports;
    exports = this;
    Client = (function() {

      function Client() {
        this.sockets = [];
        this.transports = [];
      }

      Client.prototype.connect = function(host, port, channel) {
        var portPart, url;
        portPart = (Number(port) === 80 ? "" : ":" + port);
        url = "http://" + host + portPart;
        PHM.log.info("Comet url:" + url);
        if (typeof io === "undefined") {
          PHM.log.error("Comet isn't activated");
          return;
        }
        return this.sio = this.initSocketIO(url, {
          authQuery: "sio_channel=" + channel
        });
      };

      Client.prototype.disconnect = function() {
        PHM.log.info("do disconnect");
        if (this.sio) return this.sio.disconnect();
      };

      Client.prototype.initSocketIO = function(url, details) {
        var self, socket;
        self = this;
        socket = io.connect(url, details);
        PHM.log.info("Current socket.id: " + socket.socket.sessionid);
        PHM.log.info(socket);
        socket.on("connect", function() {
          var message;
          self.sockets.push(socket.socket);
          self.transports.push(socket.socket.transport);
          message = "Connected to comet-server(" + socket.socket.sessionid + ")";
          PHM.log.info(message);
          return PHM.log.info(socket);
        });
        socket.on("message", function(msg) {
          var message, nameWithData;
          PHM.log.info("SessionID: " + socket.socket.sessionid);
          PHM.log.info("Message(Q): " + msg);
          try {
            nameWithData = jQuery.parseJSON(msg);
            return PHM.comet.dispatchEvent(nameWithData[0], nameWithData[1]);
          } catch (e) {
            message = "ERROR evaluating frame body: " + e.name + ":" + e.message;
            PHM.log.error(message);
            PHM.log.info(e);
            return PHM.log.info("on msg: " + msg);
          }
        });
        socket.on("reconnect", function() {
          PHM.log.info("Comet: Reconnected to the server");
          PHM.log.info("Current socket.id: " + socket.socket.sessionid);
          return PHM.log.info(socket);
        });
        socket.on("reconnecting", function() {
          return PHM.log.info("Comet: Attempting to re-connect to the server");
        });
        socket.on("disconnect", function() {
          return PHM.log.info("Comet: sio was disconnected");
        });
        socket.on("error", function(e) {
          PHM.log.info(e);
          return PHM.log.error("Comet", (e ? e : "An unknown error occurred"));
        });
        return socket;
      };

      return Client;

    })();
    return exports.PHM.comet.Client = Client;
  })();

}).call(this);

/*
PHM.server module
*/

(function() {
  var buildErrorCallback, buildSuccessCallback, exports, self;

  exports = this;

  self = exports.PHM.server = {};

  /*
  Common API
  */

  self.doPostCall = function(params) {
    return PHM.server.doAJAXCall('POST', params);
  };

  self.doPutCall = function(params) {
    return PHM.server.doAJAXCall('PUT', params);
  };

  self.doGetCall = function(params) {
    return PHM.server.doAJAXCall('GET', params);
  };

  self.doDeleteCall = function(params) {
    return PHM.server.doAJAXCall('DELETE', params);
  };

  self.parseResponse = function(text) {
    return $.parseJSON(text);
  };

  self.doAJAXCall = function(type, params) {
    if (!params.dataType) params.dataType = 'html';
    return $.ajax({
      type: type,
      url: params.url,
      dataType: params.dataType,
      data: params.data,
      success: buildSuccessCallback(params),
      error: buildErrorCallback(params)
    });
  };

  /*
  Common Helpers
  */

  buildSuccessCallback = function(params) {
    return function(data) {
      var response;
      if (params.dataType === 'json' || params.dataType === 'jsonp') {
        response = data;
      } else {
        response = PHM.server.parseResponse(data);
      }
      PHM.log.info(response);
      switch (response.status) {
        case "ok":
          if (params.success) return params.success(response);
          break;
        case "error":
          PHM.log.error(response.message);
          if (params.error) return params.error(response);
          break;
        default:
          return PHM.log.info("Unexpected status: " + response.status);
      }
    };
  };

  buildErrorCallback = function(params) {
    return function(data) {
      var options;
      options = {
        status: 'error',
        message: 'Critical server error',
        data: ''
      };
      PHM.log.error(params);
      if (params.error) return params.error(options);
    };
  };

}).call(this);

/*
PHM.ui.Element module
*/

(function() {
  var exports;

  exports = this;

  exports.PHM.ui.Element = {
    addClass: function(name) {
      return $("#" + this.elementId).addClass(name);
    },
    removeClass: function(name) {
      return $("#" + this.elementId).removeClass(name);
    },
    hasClass: function(name) {
      return $("#" + this.elementId).hasClass(name);
    },
    addChildElementClass: function(selector, name) {
      var element;
      element = this.getChildElement(selector);
      return element.addClass(name);
    },
    removeChildElementClass: function(selector, name) {
      var element;
      element = this.getChildElement(selector);
      return element.removeClass(name);
    },
    show: function() {
      return this.removeClass('state-hidden');
    },
    hide: function() {
      return this.addClass('state-hidden');
    },
    isHidden: function() {
      return this.hasClass('state-hidden');
    },
    isVisible: function() {
      return !this.isHidden();
    },
    startLoading: function() {
      this.addClass('loading');
      return this.disableClick();
    },
    stopLoading: function() {
      this.removeClass('loading');
      return this.enableClick();
    },
    disable: function() {
      this.addClass('disabled');
      return this.disableClick();
    },
    enable: function() {
      this.removeClass('disabled');
      return this.enableClick();
    },
    disableClick: function() {
      return this.disabled = true;
    },
    enableClick: function() {
      return this.disabled = false;
    },
    isDisabled: function() {
      return (this.disabled != null) && this.disabled === true;
    },
    activate: function() {
      return this.addClass('active');
    },
    deactivate: function() {
      return this.removeClass('active');
    },
    isActive: function() {
      return this.hasClass('active');
    },
    setIdle: function() {
      return this.addClass('idle');
    },
    removeIdle: function() {
      return this.removeClass('idle');
    },
    getChildElement: function(selector) {
      return PHM.ui.getSelector(selector, this.elementId);
    },
    showChildElement: function(selector) {
      return this.removeChildElementClass(selector, 'state-hidden');
    },
    hideChildElement: function(selector) {
      return this.addChildElementClass(selector, 'state-hidden');
    },
    toggleChildElement: function(selector) {
      var element;
      element = this.getChildElement(selector);
      return element.toggleClass('state-hidden');
    },
    setChildElementText: function(selector, text) {
      var element;
      element = this.getChildElement(selector);
      return element.text(text);
    },
    getChildElementText: function(selector) {
      var element;
      element = this.getChildElement(selector);
      return element.text();
    },
    setChildElementValue: function(selector, value) {
      var element;
      element = this.getChildElement(selector);
      return element.val(value);
    },
    getChildElementValue: function(selector) {
      var element;
      element = this.getChildElement(selector);
      return element != null ? element.val() : void 0;
    },
    emptyChildElement: function(selector) {
      var element;
      element = this.getChildElement(selector);
      return element.empty();
    }
  };

}).call(this);

/*
PHM.ui.CommonWidget module
*/

(function() {
  var exports;

  exports = this;

  exports.PHM.ui.CommonWidget = {
    renderView: function() {
      var html, params;
      params = this.prepareRenderParams != null ? this.prepareRenderParams() : {};
      if (this.contextId != null) params.contextId = this.contextId;
      html = PHM.ui.renderView(this.template || this.viewPath, params);
      return $("<p>").append($(html).attr('id', this.elementId)).html();
    },
    getElement: function() {
      return $("#" + this.elementId);
    },
    bindClick: function(callback) {
      var element, _this;
      if (callback == null) callback = null;
      element = this.getElement();
      _this = this;
      element.click(function(event) {
        if (!_this.isDisabled()) {
          if (callback != null) callback.call(_this);
          _this.fireEvent("click");
        }
        if ((_this.hasFocus != null) && _this.hasFocus === true) {
          return event.stopPropagation();
        }
      });
      return this.clickBinded = true;
    },
    setFocus: function() {
      var _this = this;
      return setTimeout(function() {
        _this.hasFocus = true;
        PHM.app.focusWidget = _this;
        _this.addClass('focus');
        if (_this.clickBinded == null) return _this.bindClick();
      }, 0);
    },
    fireBlur: function() {
      this.hasFocus = false;
      this.removeClass('focus');
      return this.fireEvent("blur");
    },
    getSelector: function(jsClass) {
      return PHM.ui.getSelector(jsClass, this.elementId);
    },
    remove: function() {
      return this.getElement().remove();
    }
  };

}).call(this);

/*
PHM.ui.Control class
*/

(function() {
  var Control, exports;

  exports = this;

  Control = (function() {

    function Control(element) {
      this.elementId = "" + this.type + "-" + (PHM.utils.generateUniqId());
      if (this.parseProperties != null) this.parseProperties(element);
      this.template = $(element).attr('template');
      this.params = {};
    }

    Control.prototype.replace = function(placeholder) {
      var classes, html;
      html = this.renderView();
      classes = placeholder.attr('class');
      placeholder.replaceWith(html);
      if (this.postInit != null) this.postInit();
      return this.getElement().addClass(classes);
    };

    Control.prototype.fireEvent = function(eventName, data) {
      if (data == null) data = null;
      return PHM.eventsDispatcher.handleControlEvent(this, eventName, data);
    };

    Control.prototype.uniqueId = function() {
      return "control-" + this.parentWidget.className + "-" + this.parentWidget.contextId + "-" + this.name;
    };

    return Control;

  })();

  PHM.utils.include(Control, PHM.ui.Element);

  PHM.utils.include(Control, PHM.ui.CommonWidget);

  exports.PHM.ui.Control = Control;

}).call(this);

/*
PHM.ui.Widget class
*/

(function() {
  var Widget, checkIfNameTaken, exports, findLibraryElements;

  exports = this;

  Widget = (function() {

    function Widget(contextId, params) {
      this.contextId = contextId;
      this.params = params;
      this.elementId = "" + this.className + "-" + this.contextId;
      this.children = [];
    }

    Widget.prototype.appendTo = function(placeholder, prepend) {
      var html;
      if (prepend == null) prepend = false;
      html = this.renderView();
      if (prepend) {
        placeholder.prepend(html);
      } else {
        placeholder.append(html);
      }
      return this.addLibraryElements();
    };

    Widget.prototype.addWidget = function(className, contextId, jsClass, params) {
      var placeholder, widget;
      if (params == null) params = null;
      placeholder = PHM.ui.getSelector(jsClass, this.elementId);
      widget = PHM.app.addWidget(className, contextId, placeholder, params);
      this.children.push(widget);
      return widget;
    };

    Widget.prototype.addSingletonWidget = function(className, jsClass, params) {
      var placeholder, widget;
      if (params == null) params = null;
      placeholder = PHM.ui.getSelector(jsClass, this.elementId);
      return widget = PHM.app.addSingletonWidget(className, placeholder, params);
    };

    Widget.prototype.removeChildren = function() {
      return _(this.children).each(function(childWidget) {
        return PHM.app.removeWidget(childWidget.className, childWidget.contextId);
      });
    };

    Widget.prototype.addLibraryElements = function() {
      var element, libraryElements, _i, _len, _results;
      libraryElements = findLibraryElements(this.getElement());
      _results = [];
      for (_i = 0, _len = libraryElements.length; _i < _len; _i++) {
        element = libraryElements[_i];
        _results.push(this.addLibraryElement($(element)));
      }
      return _results;
    };

    Widget.prototype.addLibraryElement = function(placeholder) {
      var name, type;
      type = placeholder.attr('type');
      name = placeholder.attr('name');
      checkIfNameTaken(this, name);
      return this.createLibraryElement(name, type, placeholder);
    };

    Widget.prototype.createLibraryElement = function(name, type, placeholder) {
      var element;
      element = PHM.ui.addLibraryElement(type, placeholder);
      this[name] = element;
      element.name = name;
      return element.parentWidget = this;
    };

    Widget.prototype.appendView = function(jsClass, viewPath, params) {
      var placeholder;
      placeholder = PHM.ui.getSelector(jsClass, this.elementId);
      return PHM.ui.appendView(viewPath, placeholder, params);
    };

    Widget.prototype.fireEvent = function(eventName, data) {
      if (data == null) data = null;
      return PHM.eventsDispatcher.handleWidgetEvent(this, eventName, data);
    };

    Widget.prototype.uniqueId = function() {
      return "widget-" + this.className + "-" + this.contextId;
    };

    return Widget;

  })();

  findLibraryElements = function(element) {
    return element.find('uilibrary');
  };

  checkIfNameTaken = function(widget, name) {
    var message;
    if (widget[name] != null) {
      message = "element with name: " + name + " already taken in " + widget.elementId;
      return PHM.throwException("widget", message);
    }
  };

  PHM.utils.include(Widget, PHM.ui.Element);

  PHM.utils.include(Widget, PHM.ui.CommonWidget);

  exports.PHM.ui.Widget = Widget;

}).call(this);

/*
 Library::Button class
*/

(function() {
  var Button,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Button = (function(_super) {

    __extends(Button, _super);

    function Button() {
      Button.__super__.constructor.apply(this, arguments);
    }

    Button.prototype.parseProperties = function(element) {
      this.defaultText = $(element).attr('text');
      this.removeDefaultClass = $(element).attr('remove-default-class');
      return this.template = $(element).attr('template');
    };

    Button.prototype.prepareRenderParams = function() {
      return {
        text: this.defaultText
      };
    };

    Button.prototype.postInit = function() {
      this.bindClick(function() {
        return this.startLoading();
      });
      if (this.removeDefaultClass) return this.removeClass('button');
    };

    Button.prototype.setText = function(text) {
      return this.setChildElementText('text', text);
    };

    return Button;

  })(PHM.ui.Control);

  PHM.ui.registerLibraryElement("button", Button);

}).call(this);

/*
 Library::ChatTab class
*/

(function() {
  var ChatTab,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChatTab = (function(_super) {

    __extends(ChatTab, _super);

    function ChatTab() {
      ChatTab.__super__.constructor.apply(this, arguments);
    }

    ChatTab.prototype.parseProperties = function(element) {};

    ChatTab.prototype.prepareRenderParams = function() {
      var params;
      return params = {};
    };

    ChatTab.prototype.incUnreadCount = function() {
      return this.setUnreadCount(this.unread_count + 1);
    };

    ChatTab.prototype.setUnreadCount = function(count) {
      this.unread_count = count;
      this.getElement().find('.no-messages').toggleClass('state-hidden', this.unread_count > 0);
      this.getElement().find('.message-received').toggleClass('state-hidden', this.unread_count === 0);
      return this.getElement().find('.message-received').text(count);
    };

    ChatTab.prototype.postInit = function() {
      this.bindClick();
      return this.unread_count = 0;
    };

    return ChatTab;

  })(PHM.ui.Control);

  PHM.ui.registerLibraryElement("chat_tab", ChatTab);

}).call(this);

/*
 Library::Label class
*/

(function() {
  var Label,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Label = (function(_super) {

    __extends(Label, _super);

    function Label() {
      Label.__super__.constructor.apply(this, arguments);
    }

    Label.prototype.parseProperties = function(element) {
      this.text = $(element).attr('text');
      return this.template = $(element).attr('template');
    };

    Label.prototype.prepareRenderParams = function() {
      return {
        text: this.text
      };
    };

    Label.prototype.postInit = function() {
      return this.bindClick();
    };

    Label.prototype.setText = function(txt) {
      return this.getElement().html(txt);
    };

    return Label;

  })(PHM.ui.Control);

  PHM.ui.registerLibraryElement("label", Label);

}).call(this);

/*
 Library::Slider class
*/

(function() {
  var Slider,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Slider = (function(_super) {

    __extends(Slider, _super);

    function Slider() {
      Slider.__super__.constructor.apply(this, arguments);
    }

    Slider.fireEventTimeout = 200;

    Slider.prototype.parseProperties = function(element) {
      this.minValue = Number($(element).attr('minvalue'));
      return this.maxValue = Number($(element).attr('maxvalue'));
    };

    Slider.prototype.postInit = function() {
      this.movedBuffer = 0;
      this.updateTrackPosition();
      this.bindMouseUpDown();
      return this.bindClick();
    };

    Slider.prototype.bindMouseUpDown = function() {
      var handler,
        _this = this;
      handler = function(event) {
        return _this.trackMoveHandler(event);
      };
      this.getChildElement('track').mousedown(function(event) {
        if (_this.isDisabled()) return;
        event.preventDefault();
        _this.movedBuffer = 0;
        _this.saveLastTrackPosition(event);
        _this.clickDisabled = true;
        return $(document).mousemove(handler);
      });
      return $(document).mouseup(function() {
        $(document).unbind('mousemove', handler);
        return _this.clickDisabled = false;
      });
    };

    Slider.prototype.bindClick = function() {
      var _this = this;
      return this.getElement().click(function(event) {
        var normalizedToMove, toMove;
        if (_this.isDisabled()) return;
        toMove = event.pageX - _this.lastTrackPosition;
        normalizedToMove = _this.movedValue(-toMove);
        _this.onTrackPositionMoved(normalizedToMove);
        _this.saveLastTrackPosition(event);
        return console.log(_this.clickDisabled + ' click ' + event.offsetX + ' to move: ' + toMove);
      });
    };

    Slider.prototype.trackMoveHandler = function(event) {
      var valueChange;
      this.movedBuffer += this.getTrackPositionDifference(event);
      this.saveLastTrackPosition(event);
      valueChange = this.movedValue(this.movedBuffer);
      if (Math.abs(valueChange) >= 1) {
        this.updateMovedBuffer(valueChange);
        return this.onTrackPositionMoved(valueChange);
      }
    };

    Slider.prototype.updateMovedBuffer = function(valueChange) {
      var move;
      move = Math.round(valueChange * this.sliderWidth() / this.valueInterval());
      return this.movedBuffer -= move;
    };

    Slider.prototype.updateTrackPosition = function() {
      var _ref;
      return this.lastTrackPosition = ((_ref = this.getChildElement('track').offset()) != null ? _ref.left : void 0) + 7;
    };

    Slider.prototype.saveLastTrackPosition = function(event) {
      return this.lastTrackPosition = event.pageX;
    };

    Slider.prototype.getTrackPositionDifference = function(event) {
      return this.lastTrackPosition - event.pageX;
    };

    Slider.prototype.onTrackPositionMoved = function(valueChange) {
      var _this = this;
      console.log('change: ' + valueChange);
      this.setValue(this.getValue() - valueChange);
      if (this.moveEventFireTimer == null) {
        return this.moveEventFireTimer = setTimeout(function() {
          _this.fireEvent('value_changed');
          clearTimeout(_this.moveEventFireTimer);
          return delete _this.moveEventFireTimer;
        }, Slider.fireEventTimeout);
      }
    };

    Slider.prototype.setLimits = function(min, max) {
      this.minValue = Number(min);
      return this.maxValue = Number(max);
    };

    Slider.prototype.setValue = function(value) {
      var refinedValue;
      refinedValue = this.refineValue(value);
      this.setTrackPosition(refinedValue);
      this.setTooltipValue(refinedValue);
      return this.updateTrackPosition();
    };

    Slider.prototype.getTrackPosition = function() {
      var position;
      position = this.getChildElement('track').css('right');
      return Number(position.replace(/px/, ''));
    };

    Slider.prototype.setTrackPosition = function(value) {
      var completePercentage;
      completePercentage = this.completePercentage(value);
      this.getChildElement('track').css('right', '-8px');
      return this.getChildElement('completed').width("" + completePercentage + "%");
    };

    Slider.prototype.setTooltipValue = function(value) {
      return this.setChildElementText('tooltip', value);
    };

    Slider.prototype.refineValue = function(value) {
      var refinedValue;
      refinedValue = value;
      if (value < this.minValue) refinedValue = this.minValue;
      if (value > this.maxValue) refinedValue = this.maxValue;
      return Math.round(refinedValue);
    };

    Slider.prototype.valueInterval = function() {
      return this.maxValue - this.minValue;
    };

    Slider.prototype.getValue = function() {
      return this.getChildElementText('tooltip');
    };

    Slider.prototype.completePercentage = function(value) {
      var completePercentage;
      return completePercentage = (value - this.minValue) * 100 / this.valueInterval();
    };

    Slider.prototype.movedValue = function(moved) {
      return Math.round(moved * this.valueInterval() / this.sliderWidth());
    };

    Slider.prototype.sliderWidth = function() {
      return this.getChildElement('scrollbar').width();
    };

    return Slider;

  })(PHM.ui.Control);

  PHM.ui.registerLibraryElement("slider", Slider);

}).call(this);

/*
 Library::Tab class
*/

(function() {
  var Tab,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tab = (function(_super) {

    __extends(Tab, _super);

    function Tab() {
      Tab.__super__.constructor.apply(this, arguments);
    }

    Tab.prototype.parseProperties = function(element) {
      this.text = $(element).attr('text');
      return this.label = $(element).attr('label');
    };

    Tab.prototype.prepareRenderParams = function() {
      var params;
      return params = {
        text: this.text,
        label: this.label
      };
    };

    Tab.prototype.postInit = function() {
      return this.bindClick();
    };

    return Tab;

  })(PHM.ui.Control);

  PHM.ui.registerLibraryElement("tab", Tab);

}).call(this);

/*
 Library::TextInput class
*/

(function() {
  var TextInput,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TextInput = (function(_super) {

    __extends(TextInput, _super);

    function TextInput() {
      TextInput.__super__.constructor.apply(this, arguments);
    }

    TextInput.prototype.parseProperties = function(element) {
      this.defaultValue = $(element).attr('default');
      this.template = $(element).attr('template');
      this.maxLength = $(element).attr('maxlength');
      return this.predefinedValue = $(element).attr('value');
    };

    TextInput.prototype.prepareRenderParams = function() {
      return {
        maxLength: this.maxLength
      };
    };

    TextInput.prototype.postInit = function() {
      this.setDefaultValue();
      if (this.predefinedValue != null) this.setValue(this.predefinedValue);
      return this.bindEvents();
    };

    TextInput.prototype.bindEvents = function() {
      var input;
      input = this.getChildElement('input');
      input.unbind();
      this.bindInputFocus(input);
      return this.bindInputBlur(input);
    };

    TextInput.prototype.bindInputFocus = function(input) {
      var _this = this;
      return input.focus(function() {
        _this.removeDefaultValue();
        return _this.setFocus();
      });
    };

    TextInput.prototype.bindInputBlur = function(input) {
      var _this = this;
      return input.blur(function() {
        return _this.setDefaultValue();
      });
    };

    TextInput.prototype.removeDefaultValue = function() {
      if (this.getChildElementValue('input') === this.defaultValue) {
        this.setValue('');
      }
      return this.removeIdle();
    };

    TextInput.prototype.setDefaultValue = function() {
      if (this.getChildElementValue('input') === '') {
        this.setChildElementValue('input', this.defaultValue);
        return this.setIdle();
      }
    };

    TextInput.prototype.setValue = function(value) {
      return this.setChildElementValue('input', value);
    };

    TextInput.prototype.getValue = function() {
      var rawValue, value;
      rawValue = this.getChildElementValue('input');
      value = $.trim(rawValue);
      if (value === this.defaultValue) {
        return '';
      } else {
        return value;
      }
    };

    TextInput.prototype.bindValueChange = function(callback) {
      var input,
        _this = this;
      if (callback == null) callback = null;
      input = this.getChildElement('input');
      return input.keydown(function() {
        return _this.processValueChange(callback);
      });
    };

    TextInput.prototype.processValueChange = function(callback) {
      var prevValue,
        _this = this;
      prevValue = this.getValue();
      return setTimeout(function() {
        if (prevValue !== _this.getValue()) {
          if (callback != null) callback.call(_this);
          return _this.fireEvent("value_changed");
        }
      }, 1);
    };

    TextInput.prototype.bindSubmit = function(callback) {
      var input,
        _this = this;
      if (callback == null) callback = null;
      input = this.getChildElement('input');
      return input.keypress(function(e) {
        if (e.which === PHM.ui.enterKeyCode) {
          if (callback != null) callback.call(_this);
          return _this.fireEvent("submit");
        }
      });
    };

    TextInput.prototype.disable = function() {
      this.getChildElement('input').attr('disabled', true);
      return TextInput.__super__.disable.call(this);
    };

    TextInput.prototype.enable = function() {
      this.getChildElement('input').attr('disabled', false);
      return TextInput.__super__.enable.call(this);
    };

    return TextInput;

  })(PHM.ui.Control);

  PHM.ui.registerLibraryElement("text_input", TextInput);

}).call(this);
